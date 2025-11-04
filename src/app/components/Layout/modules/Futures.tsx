"use client";

import { FunctionComponent, useMemo, memo } from "react";
import useFuturesSimulation from "../hooks/useFuturesSimulation";
import Image from "next/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const Futures: FunctionComponent<{ dict: any }> = memo(() => {
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
          key={`element-${row}-${col}`}
          className={`aspect-square gradient border border-[#dc7d2f] flex gap-1 flex-col cursor-pointer relative p-px overflow-hidden ${
            flashingElements.has(element.childId)
              ? `animate-${flashingElements.get(element.childId)}`
              : ""
          } active:bg-orange-200`}
          style={{
            gridRow: row + 1,
            gridColumn: col + 1,
          }}
          onClick={() =>
            window.open(
              `https://fgo.themanufactory.xyz/${
                Number(element?.futures?.pricePerUnit) > 0 ? "market/future" : "library/child"
              }/${element?.childContract}/${element?.childId}`
            )
          }
        >
          <div className="relative w-full h-full">
            <Image
              draggable={false}
              fill
              className="object-contain"
              src={`${INFURA_GATEWAY}${
                element?.metadata?.image?.split("ipfs://")?.[1]
              }`}
              alt={element?.metadata?.title}
            />
          </div>

          <div className="flex w-full h-fit flex-col items-center justify-center">
            <div className="text-xxs w-fit h-fit text-center leading-tight hidden md:flex">
              {element?.metadata?.title}
            </div>
            <div className="text-xxs w-fit h-fit text-center">
              {(Number(element.physicalPrice) / 10 ** 18).toFixed(2)} $MONA
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={`empty-${row}-${col}`}
        className={`aspect-square gradient border border-[#dc7d2f] ${getRandomBgColor()}`}
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
    <div className="w-full h-full lg:h-[42rem] flex flex-col items-center justify-start relative">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex hidden sm:flex">
          {Array.from({ length: gridDimensions.cols }).map((_, colIndex) => (
            <div
              key={`col-bg-${colIndex}`}
              className={`flex-1 ${
                highlightedColumns.has(colIndex) ? "bg-white" : ""
              }`}
              style={{
                marginLeft: colIndex === 0 ? 0 : "0.25rem",
                marginRight: colIndex === gridDimensions.cols - 1 ? 0 : 0,
              }}
            />
          ))}
        </div>
        <div
          className="grid gap-1 sm:gap-2 w-full h-full relative"
          style={{
            gridTemplateColumns: `repeat(${gridDimensions.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridDimensions.rows}, minmax(0, 1fr))`,
            gridAutoRows: "1fr",
          }}
        >
          {generateAllCells()}
        </div>
      </div>
    </div>
  );
});

export default Futures;
