"use client";

import { FunctionComponent, useMemo } from "react";
import useFuturesSimulation from "../hooks/useFuturesSimulation";
import Image from "next/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const Futures: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const {
    elements,
    flashingElements,
    gridDimensions,
    shouldSkipPosition,
    getRandomBgColor,
    highlightedColumns,
  } = useFuturesSimulation();

  const elementMap = useMemo(() => {
    const map = new Map<string, (typeof elements)[number]>();
    elements.forEach((element) => {
      const key = `${element.position.row}-${element.position.col}`;
      map.set(key, element);
    });
    return map;
  }, [elements]);

  const renderGridCell = (row: number, col: number) => {
    if (shouldSkipPosition(row, col)) {
      return null;
    }

    const element = elementMap.get(`${row}-${col}`);

    if (element) {
      return (
        <div
          key={`cell-${row}-${col}`}
          className={`aspect-square border border-black flex gap-1 flex-col cursor-pointer relative p-px overflow-hidden ${
            flashingElements.has(element.childId)
              ? `animate-${flashingElements.get(element.childId)}`
              : ""
          } active:bg-orange-200`}
          style={{
            gridRow: row + 1,
            gridColumn: col + 1,
          }}
        >
          <div className="relative w-full h-full">
            <Image
              draggable={false}
              fill
              className="object-contain"
              src={`${INFURA_GATEWAY}${
                element.metadata.image?.split("ipfs://")?.[1]
              }`}
              alt={element.metadata.title}
            />
          </div>

          <div className="flex w-full h-fit flex-col justify-center">
            <div className="text-xxs text-center leading-tight">
              {element.metadata.title}
            </div>
            <div className="text-xxs text-center">
              {(Number(element.physicalPrice) / 10**18).toFixed(2)} $MONA
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={`empty-${row}-${col}`}
        className={`aspect-square border border-black ${getRandomBgColor()}`}
        style={{
          gridRow: row + 1,
          gridColumn: col + 1,
        }}
      />
    );
  };

  const generateAllCells = () => {
    const cells = [];
    for (let row = 0; row < gridDimensions.rows; row++) {
      for (let col = 0; col < gridDimensions.cols; col++) {
        cells.push(renderGridCell(row, col));
      }
    }
    return cells;
  };

  return (
    <div className="w-full lex items-center justify-start relative">
      <div className="relative w-full">
        <div className="absolute inset-0 flex">
          {Array.from({ length: gridDimensions.cols }).map((_, colIndex) => (
            <div
              key={`col-bg-${colIndex}`}
              className={`flex-1 ${
                highlightedColumns.has(colIndex) ? "bg-white" : ""
              }`}
              style={{
                marginLeft: colIndex === 0 ? 0 : "0.5rem",
                marginRight: colIndex === gridDimensions.cols - 1 ? 0 : 0,
              }}
            />
          ))}
        </div>
        <div
          className="grid gap-2 w-full relative"
          style={{
            gridTemplateColumns: `repeat(${gridDimensions.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridDimensions.rows}, minmax(0, 1fr))`,
            gridAutoRows: "minmax(80px, 1fr)",
          }}
        >
          {generateAllCells()}
        </div>
      </div>
    </div>
  );
};

export default Futures;
