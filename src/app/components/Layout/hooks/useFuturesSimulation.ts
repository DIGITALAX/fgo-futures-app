import { useState, useEffect, useCallback } from "react";
import {
  FuturesSimulationElement,
  GridDimensions,
} from "../types/layout.types";
import { FLASH_PATTERNS } from "@/app/lib/constants";

const useFuturesSimulation = () => {
  const [gridDimensions, setGridDimensions] = useState<GridDimensions>({
    cols: 14,
    rows: 8,
  });
  const [elements, setElements] = useState<FuturesSimulationElement[]>([]);
  const [flashingElements, setFlashingElements] = useState<Map<string, string>>(
    new Map()
  );
  const [highlightedColumns, setHighlightedColumns] = useState<Set<number>>(
    new Set()
  );

  const generateElements = () => {
    const materials = [
      {
        name: "Silk",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
        price: 125.5,
      },
      {
        name: "Velvet",
        image:
          "https://images.unsplash.com/photo-1524678714210-9917a6c619c2?w=100&h=100&fit=crop",
        price: 89.75,
      },
      {
        name: "Cotton",
        image:
          "https://images.unsplash.com/photo-1586281010402-8c8d482ee785?w=100&h=100&fit=crop",
        price: 45.25,
      },
      {
        name: "Linen",
        image:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
        price: 78.9,
      },
      {
        name: "Denim",
        image:
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100&h=100&fit=crop",
        price: 67.4,
      },
      {
        name: "Cashmere",
        image:
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=100&h=100&fit=crop",
        price: 234.8,
      },
      {
        name: "Wool",
        image:
          "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=100&h=100&fit=crop",
        price: 156.2,
      },
      {
        name: "Leather",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop",
        price: 189.65,
      },
      {
        name: "Satin",
        image:
          "https://images.unsplash.com/photo-1558333832-a3a3fe9e5ffe?w=100&h=100&fit=crop",
        price: 112.3,
      },
      {
        name: "Chiffon",
        image:
          "https://images.unsplash.com/photo-1520637836862-4d197d17c0a4?w=100&h=100&fit=crop",
        price: 95.15,
      },
      {
        name: "Tweed",
        image:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
        price: 143.75,
      },
      {
        name: "Flannel",
        image:
          "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop",
        price: 72.85,
      },
      {
        name: "Jacquard",
        image:
          "https://images.unsplash.com/photo-1573496546038-82f9c39f6365?w=100&h=100&fit=crop",
        price: 198.4,
      },
      {
        name: "Organza",
        image:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop",
        price: 87.6,
      },
      {
        name: "Taffeta",
        image:
          "https://images.unsplash.com/photo-1558333832-92692ee0ba72?w=100&h=100&fit=crop",
        price: 105.45,
      },
      {
        name: "Crepe",
        image:
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=100&h=100&fit=crop",
        price: 93.2,
      },
      {
        name: "Gabardine",
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
        price: 134.9,
      },
      {
        name: "Paisley",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
        price: 76.35,
      },
      {
        name: "Herringbone",
        image:
          "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=100&h=100&fit=crop",
        price: 167.25,
      },
      {
        name: "Gingham",
        image:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&h=100&fit=crop",
        price: 54.8,
      },
      {
        name: "Plaid",
        image:
          "https://images.unsplash.com/photo-1544441892-794166f1e3be?w=100&h=100&fit=crop",
        price: 62.7,
      },
      {
        name: "Stripes",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
        price: 48.95,
      },
      {
        name: "Dots",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop",
        price: 39.55,
      },
      {
        name: "Floral",
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
        price: 81.4,
      },
      {
        name: "Geometric",
        image:
          "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop",
        price: 92.15,
      },
      {
        name: "Abstract",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
        price: 114.8,
      },
      {
        name: "Ikat",
        image:
          "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=100&h=100&fit=crop",
        price: 187.5,
      },
      {
        name: "Batik",
        image:
          "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=100&h=100&fit=crop",
        price: 156.25,
      },
      {
        name: "Nylon",
        image:
          "https://images.unsplash.com/photo-1558649688-53e2a6bb5d19?w=100&h=100&fit=crop",
        price: 32.45,
      },
      {
        name: "Rayon",
        image:
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop",
        price: 56.8,
      },
      {
        name: "Polyester",
        image:
          "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=100&h=100&fit=crop",
        price: 28.9,
      },
      {
        name: "Acrylic",
        image:
          "https://images.unsplash.com/photo-1618160618563-b7e0b6e7e4c2?w=100&h=100&fit=crop",
        price: 43.6,
      },
    ];

    const elements: FuturesSimulationElement[] = [];
    let materialIndex = 0;

    for (let row = 0; row < gridDimensions.rows; row++) {
      for (let col = 0; col < gridDimensions.cols; col++) {
        if (shouldSkipPosition(row, col)) {
          continue;
        }

        if (materialIndex < materials.length) {
          elements.push({
            id: `${row}-${col}`,
            ...materials[materialIndex],
            position: { row, col },
          });
          materialIndex++;
        }
      }
    }

    setElements(elements);
  };

  const shouldSkipPosition = (row: number, col: number): boolean => {
    if (row === 0 && col > 0 && col < gridDimensions.cols - 1) return true;
    if (row === 1 && col > 1 && col < Math.floor(gridDimensions.cols * 0.67))
      return true;
    if (row === 2 && col > 2 && col < Math.floor(gridDimensions.cols * 0.5))
      return true;
    if (
      row === gridDimensions.rows - 1 &&
      (col < 2 || col > gridDimensions.cols - 2)
    )
      return true;
    if (
      row === gridDimensions.rows - 2 &&
      (col < 1 || col > gridDimensions.cols - 1)
    )
      return true;
    return false;
  };

  const simulateTrade = useCallback((elementId: string, pattern?: string) => {
    const selectedPattern =
      pattern ||
      FLASH_PATTERNS[Math.floor(Math.random() * FLASH_PATTERNS.length)];
    setFlashingElements((prev) =>
      new Map(prev).set(elementId, selectedPattern)
    );

    const duration =
      selectedPattern === "flash-long"
        ? 3000
        : selectedPattern === "flash-burst"
        ? 2000
        : 1500;

    setTimeout(() => {
      setFlashingElements((prev) => {
        const newMap = new Map(prev);
        newMap.delete(elementId);
        return newMap;
      });
    }, duration);
  }, []);

  const getRandomBgColor = () => {
    const colors = ["bg-white", "bg-blue-50", "bg-amber-50"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const patterns = [
      () => {
        const indices = Array.from({ length: 4 }, () =>
          Math.floor(Math.random() * elements.length)
        );
        indices.forEach((idx, i) => {
          setTimeout(() => {
            if (elements[idx]) simulateTrade(elements[idx].id, "flash-quick");
          }, i * 100);
        });
      },
      () => {
        const indices = Array.from({ length: 2 }, () =>
          Math.floor(Math.random() * elements.length)
        );
        indices.forEach((idx) => {
          if (elements[idx]) simulateTrade(elements[idx].id, "flash-long");
        });
      },
      () => {
        const indices = Array.from({ length: 10 }, () =>
          Math.floor(Math.random() * elements.length)
        );
        indices.forEach((idx, i) => {
          setTimeout(() => {
            if (elements[idx]) simulateTrade(elements[idx].id, "flash-burst");
          }, i * 50);
        });
      },
      () => {
        const count = 3 + Math.floor(Math.random() * 3);
        const indices = Array.from({ length: count }, () =>
          Math.floor(Math.random() * elements.length)
        );
        indices.forEach((idx) => {
          if (elements[idx]) simulateTrade(elements[idx].id);
        });
      },
    ];

    const interval = setInterval(() => {
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      pattern();
    }, 800);

    return () => clearInterval(interval);
  }, [elements, simulateTrade]);

  useEffect(() => {
    if (elements?.length < 1) {
      generateElements();
    }
  }, []);

  useEffect(() => {
    const columns = new Set<number>();
    columns.add(3);

    const additionalCols = [1, 5, 7, 9, 11];
    const numAdditional = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numAdditional; i++) {
      const randomCol =
        additionalCols[Math.floor(Math.random() * additionalCols.length)];
      columns.add(randomCol);
    }

    setHighlightedColumns(columns);
  }, [gridDimensions]);

  useEffect(() => {
    const updateGridSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width < 640) {
        setGridDimensions({ cols: 8, rows: 6 });
      } else if (width < 1024) {
        setGridDimensions({ cols: 12, rows: 7 });
      } else {
        const rows = height > 900 ? 9 : height > 700 ? 8 : 7;
        setGridDimensions({ cols: 14, rows });
      }
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  return {
    elements,
    flashingElements,
    simulateTrade,
    gridDimensions,
    shouldSkipPosition,
    getRandomBgColor,
    highlightedColumns,
  };
};

export default useFuturesSimulation;
