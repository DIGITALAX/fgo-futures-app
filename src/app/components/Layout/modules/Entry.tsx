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
        <div className="relative w-full h-fit border-y border-black py-3 font-fash flex flex-row">
          <Marquee gradient={false} speed={70} direction={"right"}>
            <span className="relative text-sm px-2 whitespace-nowrap w-fit h-fit flex">
              {
                "LIQUID FASHION FUTURES ------- BOT SETTLEMENT ------- AMM LP ------- ESCROW PHYSICAL RIGHTS ------- SPECTATE FULFILLMENT ------- HEDGE SUPPLY"
              }
            </span>
          </Marquee>
        </div>
      </div>
      <Trade dict={dict} />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
        <Fulfillers dict={dict} />
        <SettlmentBots dict={dict} />
      </div>
    </div>
  );
};

export default Entry;
