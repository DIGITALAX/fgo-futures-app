import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import {
  FuturesSimulationElement,
  GraphChild,
  GridDimensions,
} from "../types/layout.types";
import { FLASH_PATTERNS, INFURA_GATEWAY } from "@/app/lib/constants";
import { getAllChildren } from "@/app/lib/subgraph/queries/getAllChildren";
import { SimulationContext } from "@/app/lib/providers/Providers";

const PATTERN_DURATIONS: Record<string, number> = {
  "flash-quick": 800,
  "flash-long": 3000,
  "flash-pulse": 1500,
  "flash-burst": 1400,
  "flash-glow": 1700,
  "flash-fade": 1600,
};

const useFuturesSimulation = () => {
  const context = useContext(SimulationContext);
  const rawChildren = context?.rawChildren ?? [];
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
  const [displayChildrenIndices, setDisplayChildrenIndices] = useState<number[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const orderQueueRef = useRef<number[]>([]);
  const orderPointerRef = useRef<number>(0);
  const rawChildrenRef = useRef<GraphChild[]>([]);

  useEffect(() => {
    rawChildrenRef.current = rawChildren;
  }, [rawChildren]);

  const shuffleArray = useCallback((input: number[]): number[] => {
    const result = [...input];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }, []);

  const shouldSkipPosition = useCallback(
    (
      row: number,
      col: number,
      dims: GridDimensions = gridDimensions
    ): boolean => {
      if (row === 0 && col > 0 && col < dims.cols - 1) return true;
      if (row === 1 && col > 1 && col < Math.floor(dims.cols * 0.67))
        return true;
      if (row === 2 && col > 2 && col < Math.floor(dims.cols * 0.5))
        return true;
      if (row === dims.rows - 1 && (col < 2 || col > dims.cols - 2))
        return true;
      if (row === dims.rows - 2 && (col < 1 || col > dims.cols - 1))
        return true;
      return false;
    },
    [gridDimensions]
  );

  const getGridCapacity = useCallback(
    (dims: GridDimensions): number => {
      let capacity = 0;
      for (let row = 0; row < dims.rows; row++) {
        for (let col = 0; col < dims.cols; col++) {
          if (!shouldSkipPosition(row, col, dims)) {
            capacity++;
          }
        }
      }
      return capacity;
    },
    [shouldSkipPosition]
  );

  const placeChildrenOnGrid = useCallback(
    (children: GraphChild[], dims: GridDimensions, indices: number[] = []) => {
      const availablePositions: { row: number; col: number }[] = [];
      for (let row = 0; row < dims.rows; row++) {
        for (let col = 0; col < dims.cols; col++) {
          if (!shouldSkipPosition(row, col, dims)) {
            availablePositions.push({ row, col });
          }
        }
      }

      if (!availablePositions.length || !children.length) return [];

      const shuffledPositions = [...availablePositions].sort(
        () => Math.random() - 0.5
      );

      const selectionIndices =
        indices.length > 0
          ? indices.filter(
              (idx) => typeof idx === "number" && idx >= 0 && idx < children.length
            )
          : children.map((_, index) => index);

      const placedElements: FuturesSimulationElement[] = [];

      let positionIndex = 0;

      for (
        let i = 0;
        i < selectionIndices.length && positionIndex < shuffledPositions.length;
        i++
      ) {
        const child = children[selectionIndices[i]];
        if (!child || !child.childId) continue;

        const metadata = child?.metadata ?? { title: "", image: "" };
        const metadataTitle =
          (metadata?.title as string | undefined) ??
          (metadata as any)?.name ??
          "";
        const metadataImage =
          (metadata?.image as string | undefined) ??
          (metadata as any)?.image_url ??
          (metadata as any)?.imageUrl ??
          "";

        const position = shuffledPositions[positionIndex];
        positionIndex += 1;
        placedElements.push({
          childId: child.childId,
          childContract: child.childContract,
          futures: child.futures,
          physicalPrice: Number(child.physicalPrice ?? 0),
          metadata: {
            title: metadataTitle,
            image: metadataImage,
          },
          position: { row: position.row, col: position.col },
        });
      }

      return placedElements;
    },
    [shouldSkipPosition]
  );

  const getFutureElements = useCallback(async () => {
    setFutureElementsLoading(true);
    try {
      const data = await getAllChildren();
      const children: GraphChild[] = data?.data?.childs || [];

      const withMetadata = await Promise.all(
        children.map(async (child) => {
          if (!child) return child;
          if (child?.metadata?.image && child?.metadata?.title) {
            return child;
          }
          if (!child.uri) return child;

          try {
            const resolvedUri =
              typeof child.uri === "string" && child.uri.startsWith("ipfs://")
                ? `${INFURA_GATEWAY}${child.uri.replace("ipfs://", "")}`
                : child.uri;

            if (!resolvedUri) {
              return child;
            }

            const response = await fetch(resolvedUri);
            const metadata = await response.json();
            return {
              ...child,
              metadata,
            };
          } catch (error) {
            console.error("Failed to load child metadata", error);
            return child;
          }
        })
      );

      context?.setRawChildren(withMetadata);
    } catch (err: any) {
      console.error(err?.message || err);
    } finally {
      setFutureElementsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!rawChildren.length) {
      orderQueueRef.current = [];
      orderPointerRef.current = 0;
      setDisplayChildrenIndices([]);
      return;
    }

    orderQueueRef.current = shuffleArray(
      Array.from({ length: rawChildren.length }, (_, index) => index)
    );
    orderPointerRef.current = 0;
    setDisplayChildrenIndices([]);
  }, [rawChildren, shuffleArray]);

  const pullIndices = useCallback(
    (count: number): number[] => {
      const total = rawChildrenRef.current.length;
      if (!total || count <= 0) return [];

      const desired = Math.min(count, total);
      const pulled: number[] = [];

      const regenerateQueue = () => {
        orderQueueRef.current = shuffleArray(
          Array.from({ length: total }, (_, index) => index)
        );
        orderPointerRef.current = 0;
      };

      if (
        !orderQueueRef.current.length ||
        orderQueueRef.current.length !== total
      ) {
        regenerateQueue();
      }

      while (pulled.length < desired) {
        if (orderPointerRef.current >= orderQueueRef.current.length) {
          regenerateQueue();
        }

        const candidate = orderQueueRef.current[orderPointerRef.current];
        orderPointerRef.current += 1;

        if (typeof candidate === "number") {
          pulled.push(candidate);
        } else {
          break;
        }
      }

      return pulled;
    },
    [shuffleArray]
  );

  const simulateTrade = useCallback((elementId: string, pattern?: string) => {
    const selectedPattern =
      pattern ??
      FLASH_PATTERNS[Math.floor(Math.random() * FLASH_PATTERNS.length)];

    setFlashingElements((prev) => {
      const updated = new Map(prev);
      updated.set(elementId, selectedPattern);
      return updated;
    });

    const duration =
      PATTERN_DURATIONS[selectedPattern] ?? PATTERN_DURATIONS["flash-quick"];

    const timeout =
      typeof window !== "undefined"
        ? window.setTimeout
        : (cb: () => void, delay: number) => setTimeout(cb, delay);

    timeout(() => {
      setFlashingElements((prev) => {
        const newMap = new Map(prev);
        newMap.delete(elementId);
        return newMap;
      });
    }, duration);
  }, []);

  useEffect(() => {
    if (!rawChildren.length) {
      setElements([]);
      return;
    }

    const positioned = placeChildrenOnGrid(
      rawChildren,
      gridDimensions,
      displayChildrenIndices
    );
    setElements(positioned);

    if (positioned.length > 0 && gridDimensions.cols > 0) {
      const maxRow = Math.max(...positioned.map((el) => el.position.row));
      const requiredRows = maxRow + 1;
      const minRows = Math.ceil(positioned.length / gridDimensions.cols) + 1;
      const newRows = Math.max(requiredRows, minRows, 7);

      if (newRows !== gridDimensions.rows) {
        setGridDimensions((prev) => ({ ...prev, rows: newRows }));
      }
    }
  }, [rawChildren, gridDimensions, displayChildrenIndices, placeChildrenOnGrid]);

  const getRandomBgColor = () => {
    const colors = ["bg-white", "bg-blue-50", "bg-amber-50", "bg-orange-50"];
    const animations = ["", "animate-grid-sheen", "animate-grid-pulse"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const animation = animations[Math.floor(Math.random() * animations.length)];
    return `${color} ${animation}`.trim();
  };

  useEffect(() => {
    if (!elements.length) return;

    const patternTimeouts: ReturnType<typeof setTimeout>[] = [];

    const schedule = (cb: () => void, delay: number) => {
      const timeoutId = setTimeout(cb, delay);
      patternTimeouts.push(timeoutId);
    };

    const pickRandomElements = (count: number) => {
      if (!elements.length) return [] as FuturesSimulationElement[];
      const shuffled = [...elements].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, shuffled.length));
    };

    const runPattern = () => {
      if (!elements.length) return;

      const patterns: Array<() => void> = [
        () => {
          const picks = pickRandomElements(7);
          picks.forEach((element, idx) => {
            schedule(
              () =>
                simulateTrade(
                  element.childId,
                  idx % 2 === 0 ? "flash-quick" : "flash-burst"
                ),
              idx * 70
            );
          });
        },
        () => {
          const picks = pickRandomElements(2);
          picks.forEach((element, idx) => {
            schedule(
              () =>
                simulateTrade(
                  element.childId,
                  idx === 0 ? "flash-long" : "flash-glow"
                ),
              idx * 120
            );
          });
        },
        () => {
          const columns = Array.from(
            new Set(elements.map((element) => element.position.col))
          );
          if (!columns.length) return;
          const targetColumn =
            columns[Math.floor(Math.random() * columns.length)];
          const columnElements = elements.filter(
            (element) => element.position.col === targetColumn
          );
          columnElements.forEach((element, idx) => {
            schedule(
              () =>
                simulateTrade(
                  element.childId,
                  idx % 2 === 0 ? "flash-long" : "flash-glow"
                ),
              idx * 80
            );
          });
        },
        () => {
          const rows = Array.from(
            new Set(elements.map((element) => element.position.row))
          );
          if (!rows.length) return;
          const targetRow = rows[Math.floor(Math.random() * rows.length)];
          const rowElements = elements.filter(
            (element) => element.position.row === targetRow
          );
          rowElements.forEach((element, idx) => {
            schedule(
              () =>
                simulateTrade(
                  element.childId,
                  idx % 2 === 0 ? "flash-long" : "flash-pulse"
                ),
              idx * 90
            );
          });
        },
        () => {
          const picks = pickRandomElements(4 + Math.floor(Math.random() * 4));
          picks.forEach((element, idx) => {
            schedule(
              () =>
                simulateTrade(
                  element.childId,
                  idx % 3 === 0 ? "flash-fade" : "flash-burst"
                ),
              idx * 60
            );
          });
        },
      ];

      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      pattern();
    };

    runPattern();
    const interval = setInterval(runPattern, 700);

    return () => {
      clearInterval(interval);
      patternTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [elements, simulateTrade]);

  useEffect(() => {
    if (!rawChildren.length) return;

    const runCycle = () => {
      const capacity = getGridCapacity(gridDimensions);
      if (!capacity) return;

      const maxVisible = Math.min(capacity, rawChildren.length);
      if (!maxVisible) return;

      const baseCount = Math.max(6, Math.floor(maxVisible * 0.55));
      const extraRange = Math.max(1, maxVisible - baseCount);
      let targetCount =
        baseCount + Math.floor(Math.random() * (extraRange + 1));

      if (Math.random() > 0.65) {
        targetCount = maxVisible;
      }

      const nextIndices = pullIndices(Math.min(maxVisible, targetCount));
      if (nextIndices.length) {
        setDisplayChildrenIndices(nextIndices);
      }
    };

    runCycle();
    const interval = setInterval(runCycle, 900);
    return () => clearInterval(interval);
  }, [rawChildren, gridDimensions, getGridCapacity, pullIndices]);

  useEffect(() => {
    if (Number(context?.rawChildren?.length) < 1 && !futureElementsLoading) {
      getFutureElements();
    }
  }, []);

  useEffect(() => {
    if (!gridDimensions.cols) return;

    const updateColumns = () => {
      const columns = new Set<number>();
      const anchor = Math.floor(Math.random() * gridDimensions.cols);
      columns.add(anchor);

      const spread = Math.floor(Math.random() * 2) + 1;
      for (let i = 1; i <= spread; i++) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const candidate = anchor + direction * i;
        if (candidate >= 0 && candidate < gridDimensions.cols) {
          columns.add(candidate);
        }
      }

      const favoredColumns = [1, 3, 5, 7, 9, 11].filter(
        (col) => col < gridDimensions.cols
      );
      favoredColumns.forEach((col) => {
        if (Math.random() > 0.6) {
          columns.add(col);
        }
      });

      setHighlightedColumns(columns);
    };

    updateColumns();
    const interval = setInterval(updateColumns, 1400);
    return () => clearInterval(interval);
  }, [gridDimensions.cols]);

  useEffect(() => {
    const updateGridSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let cols = 14;
      if (width < 640) {
        cols = 6;
      } else if (width < 1024) {
        cols = 10;
      }

      const rows = height > 900 ? 9 : height > 700 ? 8 : 7;
      setGridDimensions({ cols, rows });
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
