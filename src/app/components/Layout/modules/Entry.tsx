"use client";

import { FunctionComponent, useContext, useRef } from "react";
import Futures from "./Futures";
import Trade from "./Trade";
import Settlement from "./Settlement";
import Marquee from "react-fast-marquee";
import Fulfillers from "./Fulfillers";
import SettlementBots from "./SettlementBots";
import { AppContext } from "@/app/lib/providers/Providers";
import Supply from "./Supply";
import Drag from "./Drag";
import Suppliers from "./Suppliers";
import SettlementSupply from "./SettlementSupply";

const Entry: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const contexto = useContext(AppContext);
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="w-full flex flex-col items-center justify-center relative"
      ref={containerRef}
    >
      <div className="relative w-full flex flex-col">
        <div className="relative w-full lg:h-[45rem] flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-8 p-2 sm:p-4">
          <Futures dict={dict} />
          {contexto?.type == 0 ? (
            <Settlement dict={dict} />
          ) : (
            <SettlementSupply dict={dict} />
          )}
        </div>
        <div className="relative w-full h-fit border-y border-black py-3 font-fash flex flex-row">
          <Marquee gradient={false} speed={70} direction={"right"}>
            <span className="relative text-sm px-2 whitespace-nowrap w-fit h-fit flex">
              {dict?.marqueeText}
            </span>
          </Marquee>
        </div>
      </div>
      <div className="w-full h-fit flex pt-2 sm:pt-4 lg:pt-6 px-2 sm:px-4 lg:px-6 relative font-liq">
        <div className="relative w-fit h-fit flex gap-2 z-10">
          <div
            className={`px-3 py-2 border cursor-pointer text-xs ${
              contexto?.type == 1
                ? "border-white bg-black text-white"
                : "border-black bg-white text-black"
            }`}
            onClick={() => contexto?.setType(1)}
          >
            {dict?.supplyFuturesTab}
          </div>
          <div
            className={`px-3 py-2 border cursor-pointer text-xs ${
              contexto?.type == 0
                ? "border-white bg-black text-white"
                : "border-black bg-white text-black"
            }`}
            onClick={() => contexto?.setType(0)}
          >
            {dict?.fulfillmentFuturesTab}
          </div>
        </div>
      </div>
      {contexto?.type == 0 ? <Trade dict={dict} /> : <Supply dict={dict} />}
      {contexto?.type == 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 h-fit p-2 sm:p-4">
          <Fulfillers dict={dict} />
          <SettlementBots dict={dict} />
        </div>
      ) : (
        <Suppliers dict={dict} />
      )}
      {contexto?.dragBox && <Drag containerRef={containerRef} />}
    </div>
  );
};

export default Entry;
