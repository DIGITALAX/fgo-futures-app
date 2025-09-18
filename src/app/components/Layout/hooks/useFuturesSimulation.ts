import { useState, useEffect, useCallback } from "react";
import {
  FuturesSimulationElement,
  GridDimensions,
} from "../types/layout.types";
import { FLASH_PATTERNS, INFURA_GATEWAY } from "@/app/lib/constants";
import { getSimChildren } from "@/app/lib/subgraph/queries/getSimChildren";

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
  const [futureElementsLoading, setFutureElementsLoading] =
    useState<boolean>(false);

  const getFutureElements = async () => {
    setFutureElementsLoading(true);
    try {
      const data = await getSimChildren();
      const elements: FuturesSimulationElement[] = [];
      let materialIndex = 0;

      for (let row = 0; row < gridDimensions.rows; row++) {
        for (let col = 0; col < gridDimensions.cols; col++) {
          if (shouldSkipPosition(row, col)) {
            continue;
          }

          if (materialIndex < data?.data?.childs?.length) {
            if (
              !data?.data?.childs?.[materialIndex] &&
              data?.data?.childs?.[materialIndex].uri
            ) {
              const response = await fetch(
                `${INFURA_GATEWAY}${data?.data?.childs?.[
                  materialIndex
                ].uri.replace("ipfs://", "")}`
              );

              data.data.childs[materialIndex].metadata = await response.json();
            }
            elements.push({
              id: `${row}-${col}`,
              ...data?.data?.childs?.[materialIndex],
              position: { row, col },
            });
            materialIndex++;
          }
        }
      }

      setElements(elements);
    } catch (err: any) {
      console.error(err.message);
    }
    setFutureElementsLoading(false);
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
            if (elements[idx])
              simulateTrade(elements[idx].childId, "flash-quick");
          }, i * 100);
        });
      },
      () => {
        const indices = Array.from({ length: 2 }, () =>
          Math.floor(Math.random() * elements.length)
        );
        indices.forEach((idx) => {
          if (elements[idx]) simulateTrade(elements[idx].childId, "flash-long");
        });
      },
      () => {
        const indices = Array.from({ length: 10 }, () =>
          Math.floor(Math.random() * elements.length)
        );
        indices.forEach((idx, i) => {
          setTimeout(() => {
            if (elements[idx])
              simulateTrade(elements[idx].childId, "flash-burst");
          }, i * 50);
        });
      },
      () => {
        const count = 3 + Math.floor(Math.random() * 3);
        const indices = Array.from({ length: count }, () =>
          Math.floor(Math.random() * elements.length)
        );
        indices.forEach((idx) => {
          if (elements[idx]) simulateTrade(elements[idx].childId);
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
    if (elements?.length < 1 && !futureElementsLoading) {
      getFutureElements();
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
    futureElementsLoading,
  };
};

export default useFuturesSimulation;
