#!/usr/bin/env node

/**
 * Heuristic audit of user-facing English strings within TS/TSX components.
 * Outputs JSON array with file, line, column, and text.
 */

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const projectRoot = process.cwd();

const targetDirs = [
  "src/app/components",
  "src/app/lib/providers",
];

const ignoreAttrNames = new Set([
  "className",
  "style",
  "fill",
  "stroke",
  "width",
  "height",
  "viewBox",
  "src",
  "alt",
  "href",
  "target",
  "rel",
  "objectFit",
  "id",
  "htmlFor",
  "type",
  "value",
  "min",
  "max",
  "step",
  "placeholder",
  "draggable",
  "scrollableTarget",
  "scrollThreshold",
]);

const stringEntries = [];

const shouldSkipString = (text) => {
  if (!text || !/[a-zA-Z]/.test(text)) return true;
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (/^(https?:|ipfs:|0x)/i.test(trimmed)) return true;
  if (/^[A-Za-z][A-Za-z0-9_-]*$/.test(trimmed) && trimmed.length > 20)
    return true;
  return false;
};

const addEntry = (sourceFile, node, text) => {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(
    node.getStart()
  );
  stringEntries.push({
    file: path.relative(projectRoot, sourceFile.fileName),
    line: line + 1,
    column: character + 1,
    text,
  });
};

const visitNode = (sourceFile, node) => {
  if (ts.isJsxText(node)) {
    const text = node.getText().replace(/\s+/g, " ").trim();
    if (!shouldSkipString(text)) {
      addEntry(sourceFile, node, text);
    }
  } else if (
    ts.isStringLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node)
  ) {
    if (ts.isJsxAttribute(node.parent)) {
      const attrName = node.parent.name.getText();
      if (ignoreAttrNames.has(attrName)) return;
    }
    if (
      ts.isImportDeclaration(node.parent) ||
      ts.isExportDeclaration(node.parent)
    ) {
      return;
    }
    const text = node.text.trim();
    if (!shouldSkipString(text)) {
      addEntry(sourceFile, node, text);
    }
  }
  ts.forEachChild(node, (child) => visitNode(sourceFile, child));
};

const collectFromFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const scriptKind = filePath.endsWith(".tsx")
    ? ts.ScriptKind.TSX
    : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.ESNext,
    true,
    scriptKind
  );
  visitNode(sourceFile, sourceFile);
};

const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      collectFromFile(fullPath);
    }
  }
};

for (const dir of targetDirs) {
  walk(path.join(projectRoot, dir));
}

stringEntries.sort((a, b) => {
  if (a.file === b.file) {
    return a.line - b.line || a.column - b.column;
  }
  return a.file.localeCompare(b.file);
});

console.log(JSON.stringify(stringEntries, null, 2));
