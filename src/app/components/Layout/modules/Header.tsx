"use client";

import { FunctionComponent, useContext } from "react";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/navigation";
import useHeader from "../hooks/useHeader";
import { AppContext } from "@/app/lib/providers/Providers";

const Header: FunctionComponent<{ dict: any, lang: string }> = ({ dict, lang }) => {
  const context = useContext(AppContext);

  const handleFGOClick = () => {
    window.open("https://fgo.themanufactory.xyz", "_blank");
  };

  const handleInfoClick = () => {
    context?.setDragBox((prev) => !prev);
  };

  const {
    handleLanguageChange,
    languageOptions,
    statsLoading,
    isLanguageDropdownOpen,
    setIsLanguageDropdownOpen,
  } = useHeader();

  return (
    <div
      dir={lang == "yi" ? "rtl" : "ltr"}
      className="w-full h-fit flex px-4 flex-wrap items-center justify-between relative gap-3"
    >
      <div className="relative w-fit h-fit flex gap-2 z-10 flex-wrap">
        <div className="px-3 py-2 border border-black bg-white text-xs">
          {dict?.monaLabel}{" "}
          {statsLoading ? "..." : context?.stats.mona.toFixed(2) || "0.00"}
        </div>
        <div className="px-3 py-2 border border-black bg-white text-xs">
          {dict?.genesisLabel}{" "}
          {statsLoading ? "..." : context?.stats.genesis || "0"}
        </div>
        <div
          className="px-3 py-2 border cursor-pointer border-black bg-white text-xs"
          onClick={() => window.open("https://ionic.digitalax.xyz")}
        >
          {dict?.ionicLabel}{" "}
          {statsLoading ? "..." : context?.stats.ionic || "0"}
        </div>
        <div className="px-3 py-2 border border-black bg-white text-xs">
          {dict?.blockLabel} {context?.stats.blockTimestamp}
        </div>
      </div>
      <div className="relative w-fit h-fit flex gap-2 z-10 flex-wrap">
        <div className="relative w-fit h-fit">
          <div
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="px-3 py-2 border border-black bg-white text-xs cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {languageOptions.find(
              (opt) => opt.code === context?.selectedLanguage
            )?.name ?? "Aussie"}
          </div>
          {isLanguageDropdownOpen && (
            <div className="absolute text-xs z-20 w-full mt-1 border border-black bg-white cursor-pointer">
              {languageOptions.map(({ code, name }) => (
                <div
                  key={code}
                  onClick={() => {
                    handleLanguageChange({
                      target: { value: code },
                    } as any);
                    setIsLanguageDropdownOpen(false);
                  }}
                  className="px-1 py-2 text-center hover:bg-gray-50 transition-colors"
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          onClick={handleFGOClick}
          className="px-3 py-2 border border-black bg-white text-xs cursor-pointer hover:bg-gray-50 transition-colors"
        >
          {dict?.fgoV3}
        </div>
        <div
          onClick={handleInfoClick}
          className="px-3 py-2 border border-black bg-white text-xs cursor-pointer hover:bg-gray-50 transition-colors"
        >
          {dict?.infoLabel}
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
                  <>
                    {isConnecting
                      ? dict?.connectingLabel
                      : dict?.connectWalletLabel}
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
