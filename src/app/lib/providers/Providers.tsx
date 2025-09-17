"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { createContext, useState } from "react";
import { chains } from "@lens-chain/sdk/viem";
import { getCurrentNetwork } from "../constants";
import {
  AppContextType,
  ErrorData,
  FillOrderModal,
  HeaderStats,
  OpenContractModal,
  SellOrderModal,
  SuccessData,
} from "@/app/components/Modals/types/models.types";
import { SettlementBot } from "@/app/components/Layout/types/layout.types";

const currentNetwork = getCurrentNetwork();

export const AppContext = createContext<AppContextType | undefined>(undefined);

const config = createConfig(
  getDefaultConfig({
    appName: "FGO Futures",
    appDescription: "Fractional Garment Ownership Futures.",
    appUrl: "https://futures.themanufactory.xyz",
    appIcon: "https://futures.themanufactory.xyz/favicon.ico",
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
    chains: [chains.testnet],
    connectors: [],
    transports: {
      [currentNetwork.chainId]: http(),
    },
  })
);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [settlementBots, setSettlementBots] = useState<SettlementBot[]>([]);
  const [openContract, setOpenContract] = useState<
    OpenContractModal | undefined
  >();
  const [sellOrder, setSellOrder] = useState<SellOrderModal | undefined>();
  const [fillOrder, setFillOrder] = useState<FillOrderModal | undefined>();
  const [stats, setStats] = useState<HeaderStats>({
    mona: 0,
    genesis: 0,
    dlta: 0,
  });

  const showSuccess = (message: string, txHash?: string) => {
    setSuccessData({ message, txHash });
  };

  const showError = (message: string) => {
    setErrorData({ message });
  };

  const hideSuccess = () => {
    setSuccessData(null);
  };

  const hideError = () => {
    setErrorData(null);
  };

  const contextValue: AppContextType = {
    showSuccess,
    showError,
    hideSuccess,
    hideError,
    successData,
    errorData,
    settlementBots,
    setSettlementBots,
    openContract,
    setOpenContract,
    sellOrder,
    setSellOrder,
    fillOrder,
    setFillOrder,
    stats,
    setStats,
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="midnight">
          <AppContext.Provider value={contextValue}>
            {children}
          </AppContext.Provider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
