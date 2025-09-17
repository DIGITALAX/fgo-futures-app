"use client";

import { FunctionComponent } from "react";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/navigation";

const Header: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const router = useRouter();

  const handleFGOClick = () => {
    window.open("https://fgo.themanufactory.xyz", "_blank");
  };

  const handleInfoClick = () => {
    router.push("/info");
  };

  return (
    <div className="w-full h-fit flex px-4 items-center justify-end relative">
      <div className="relative w-fit h-fit flex gap-2 z-10">
        <div
          onClick={handleFGOClick}
          className="px-3 py-2 border border-black flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>FGO V3</span>
        </div>
        <div
          onClick={handleInfoClick}
          className="px-3 py-2 border border-black flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span>Info</span>
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
                className="px-3 py-2 border border-black flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {isConnected ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>
                      {ensName ||
                        `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span>
                      {isConnecting ? "Connecting..." : "Connect Wallet"}
                    </span>
                  </>
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
