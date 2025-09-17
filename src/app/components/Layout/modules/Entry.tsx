"use client";

import { FunctionComponent } from "react";
import Futures from "./Futures";
import Trade from "./Trade";
import Settlement from "./Settlement";
import Marquee from "react-fast-marquee";
import Fulfillers from "./Fulfillers";
import SettlmentBots from "./SettlementBots";

const Entry: FunctionComponent<{ dict: any }> = ({ dict }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      <div className="relative w-full flex flex-col">
        <div className="relative w-full h-[45rem] flex flex-row justify-between items-start gap-8 p-4">
          <Futures dict={dict} />
          <Settlement dict={dict} />
        </div>
        <div className="relative w-full h-10 border-y border-black py-3 flex flex-row">
          <Marquee gradient={false} speed={70} direction={"right"}>
            {Array.from({ length: 30 }).map((_, index: number) => {
              return (
                <span className="relative text-sm px-5" key={index}>
                  LIQUID FASHION FUTURES ** BOT SETTLEMENT ** AMM LP ** ESCROW
                  PHYSICAL RIGHTS ** SPECTATE FULFILLMENT **
                </span>
              );
            })}
          </Marquee>
        </div>
      </div>
      <Trade dict={dict} />
      <SettlmentBots dict={dict} />
    </div>
  );
};

export default Entry;
