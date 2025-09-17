"use client";

import { FunctionComponent } from "react";
import useFuturesSimulation from "../hooks/useFuturesSimulation";
import Image from "next/image";

const Futures: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const {
    elements,
    flashingElements,
    gridDimensions,
    shouldSkipPosition,
    getRandomBgColor,
    highlightedColumns,
  } = useFuturesSimulation();

  const renderGridCell = (row: number, col: number) => {
    if (shouldSkipPosition(row, col)) {
      return null;
    }

    const element = elements.find(
      (el) => el.position.row === row && el.position.col === col
    );

    if (element) {
      return (
        <div
          key={element.id}
          className={`aspect-square border border-black flex flex-col cursor-pointer relative overflow-hidden ${
            flashingElements.has(element.id)
              ? `animate-${flashingElements.get(element.id)}`
              : ""
          }`}
          style={{
            gridRow: row + 1,
            gridColumn: col + 1,
          }}
        >
          <div className="relative w-full h-3/4">
            <Image
              draggable={false}
              fill
              className="object-cover"
              src={element.image}
              alt={element.name}
            />
          </div>

          <div className="flex w-full h-1/4 p-1 flex-col justify-center">
            <div className="text-xs text-center font-medium leading-tight">
              {element.name}
            </div>
            <div className="text-xxs text-center font-normal">
              {element.price} $MONA
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
                highlightedColumns.has(colIndex)
                  ? "bg-white"
                  : ""
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
            gridAutoRows: "minmax(80px, 1fr)"
          }}
        >
          {generateAllCells()}
        </div>
      </div>
    </div>
  );
};

export default Futures;
