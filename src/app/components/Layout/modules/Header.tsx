"use client";

import { FunctionComponent, useContext } from "react";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/navigation";
import useHeader from "../hooks/useHeader";
import { AppContext } from "@/app/lib/providers/Providers";

const Header: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const router = useRouter();
  const context = useContext(AppContext);

  const handleFGOClick = () => {
    window.open("https://fgo.themanufactory.xyz", "_blank");
  };

  const handleInfoClick = () => {
    router.push("/info");
  };

  const { statsLoading } = useHeader();

  return (
    <div className="w-full h-fit flex px-4 items-center justify-between relative">
      <div className="relative w-fit h-fit flex gap-2 z-10">
        <div className="px-3 py-2 border border-black bg-white text-xs">
          $MONA:{" "}
          {statsLoading ? "..." : context?.stats.mona.toFixed(2) || "0.00"}
        </div>
        <div className="px-3 py-2 border border-black bg-white text-xs">
          Genesis: {statsLoading ? "..." : context?.stats.genesis || "0"}
        </div>
        <div className="px-3 py-2 border border-black bg-white text-xs">
          DLTA: {statsLoading ? "..." : context?.stats.dlta || "0"}
        </div>
        <div className="px-3 py-2 border border-black bg-white text-xs">
          Block: {context?.stats.blockTimestamp}
        </div>
      </div>
      <div className="relative w-fit h-fit flex gap-2 z-10">
        <div
          onClick={handleFGOClick}
          className="px-3 py-2 border border-black bg-white text-xs cursor-pointer hover:bg-gray-50 transition-colors"
        >
          FGO V3
        </div>
        <div
          onClick={handleInfoClick}
          className="px-3 py-2 border border-black bg-white text-xs cursor-pointer hover:bg-gray-50 transition-colors"
        >
          Info
        </div>
        <ConnectKitButton.Custom>
          {({
            isConnected,
            isConnecting,
            show,
            hide,
            address,
            ensName,
            chain,
          }) => {
            return (
              <div
                onClick={show}
                className="px-3 py-2 border border-black bg-white text-xs cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {isConnected ? (
                  <>
                    {ensName ||
                      `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                  </>
                ) : (
                  <>{isConnecting ? "Connecting..." : "Connect Wallet"}</>
                )}
              </div>
            );
          }}
        </ConnectKitButton.Custom>
      </div>
    </div>
  );
};

export default Header;
