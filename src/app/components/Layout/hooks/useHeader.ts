import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { AppContext } from "@/app/lib/providers/Providers";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { Language } from "../types/layout.types";

const useHeader = () => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const network = getCurrentNetwork();
  const router = useRouter();
  const path = usePathname();
  const contracts = getCoreContractAddresses(network.chainId);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] =
    useState<boolean>(false);

  const currentLang = (path.split("/")[1] || "en") as Language;
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(currentLang);

  const languageOptions = [
    { code: "en" as Language, name: "Aussie" },
    { code: "es" as Language, name: "Español" },
    { code: "yi" as Language, name: "יישיד" },
    { code: "pt" as Language, name: "Português" },
    { code: "fr" as Language, name: "Français" },
    { code: "gd" as Language, name: "Gàidhlig" },
  ];

  const handleMinStake = async () => {
    if (!publicClient) return;
    try {
      const [stake, maxbps, minbps] = [
        await publicClient.readContract({
          address: contracts.settlement,
          abi: ABIS.FGOFuturesSettlement,
          functionName: "getMinStakeAmount",
          args: [],
        }),
        await publicClient.readContract({
          address: contracts.futures,
          abi: ABIS.FGOFuturesContract,
          functionName: "MAX_Settlement_REWARD_BPS",
          args: [],
        }),
        await publicClient.readContract({
          address: contracts.futures,
          abi: ABIS.FGOFuturesContract,
          functionName: "MIN_Settlement_REWARD_BPS",
          args: [],
        }),
      ];
      context?.setMinValues({
        stake: Number(stake) / 10 ** 18,
        bpsMax: Number(maxbps),
        bpsMin: Number(minbps),
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getStats = async () => {
    if (!publicClient || !address) return;
    setStatsLoading(true);
    try {
      const [monaBalance, ionicBalance, genesisBalance, currentBlock] =
        await Promise.all([
          publicClient.readContract({
            address: contracts.mona,
            abi: [
              {
                type: "function",
                name: "balanceOf",
                inputs: [
                  { name: "owner", type: "address", internalType: "address" },
                ],
                outputs: [
                  { name: "", type: "uint256", internalType: "uint256" },
                ],
                stateMutability: "view",
              },
            ],
            functionName: "balanceOf",
            args: [address],
          }),
          publicClient.readContract({
            address: contracts.ionic,
            abi: [
              {
                type: "function",
                name: "balanceOf",
                inputs: [
                  { name: "owner", type: "address", internalType: "address" },
                ],
                outputs: [
                  { name: "", type: "uint256", internalType: "uint256" },
                ],
                stateMutability: "view",
              },
            ],
            functionName: "balanceOf",
            args: [address],
          }),
          publicClient.readContract({
            address: contracts.genesis,
            abi: [
              {
                type: "function",
                name: "balanceOf",
                inputs: [
                  { name: "owner", type: "address", internalType: "address" },
                ],
                outputs: [
                  { name: "", type: "uint256", internalType: "uint256" },
                ],
                stateMutability: "view",
              },
            ],
            functionName: "balanceOf",
            args: [address],
          }),
          publicClient.getBlock(),
        ]);

      context?.setStats({
        mona: Number(monaBalance) / 10 ** 18,
        ionic: Number(ionicBalance),
        genesis: Number(genesisBalance),
        blockTimestamp: Number(currentBlock.timestamp),
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setStatsLoading(false);
  };

  const handleLanguageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newLanguage = event.target.value as Language;
      setSelectedLanguage(newLanguage);

      const segments = path.split("/");
      const hasLangSegment =
        segments[1] && ["en", "es", "pt"].includes(segments[1]);

      let newPath;
      if (hasLangSegment) {
        segments[1] = newLanguage;
        newPath = segments.join("/");
      } else {
        newPath = `/${newLanguage}${path}`;
      }

      document.cookie = `NEXT_LOCALE=${newLanguage}; path=/; SameSite=Lax`;

      router.push(newPath);
    },
    [path, router]
  );

  const updateBlockTimestamp = async () => {
    if (!publicClient) return;

    try {
      const currentBlock = await publicClient.getBlock();
      context?.setStats((prev) => ({
        ...prev,
        blockTimestamp: Number(currentBlock.timestamp),
      }));
    } catch (err: any) {
      console.error("Failed to update block timestamp:", err.message);
    }
  };

  useEffect(() => {
    if (
      !statsLoading &&
      address &&
      publicClient &&
      context &&
      Object.values(context?.stats).every((val) => val == 0)
    )
      getStats();
  }, [address, publicClient, context, context?.hideSuccess]);

  useEffect(() => {
    if (
      (!context?.minValues?.stake || context?.minValues?.stake == 0) &&
      publicClient
    ) {
      handleMinStake();
    }
  }, [publicClient]);

  useEffect(() => {
    updateBlockTimestamp();
    const interval = setInterval(updateBlockTimestamp, 90000);
    return () => clearInterval(interval);
  }, [publicClient]);

  return {
    statsLoading,
    handleLanguageChange,
    selectedLanguage,
    languageOptions,
    isLanguageDropdownOpen,
    setIsLanguageDropdownOpen,
  };
};

export default useHeader;
