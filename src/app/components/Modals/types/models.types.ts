import { SetStateAction } from "react";
import {
  FutureContract,
  Language,
  SettlementBot,
} from "../../Layout/types/layout.types";

export interface SuccessData {
  message: string;
  txHash?: string;
}

export interface ErrorData {
  message: string;
}

export interface AppContextType {
  showSuccess: (message: string, txHash?: string) => void;
  showError: (message: string) => void;
  hideSuccess: () => void;
  selectedLanguage: Language;
  setSelectedLanguage: (e: SetStateAction<Language>) => void;
  hideError: () => void;
  successData: SuccessData | null;
  errorData: ErrorData | null;
  settlementBots: SettlementBot[];
  setSettlementBots: (e: SetStateAction<SettlementBot[]>) => void;
  hasMoreSettlementBots: boolean;
  setHasMoreSettlementBots: (e: SetStateAction<boolean>) => void;
  openContract: OpenContractModal | undefined;
  setOpenContract: (e: SetStateAction<OpenContractModal | undefined>) => void;
  sellOrder: SellOrderModal | undefined;
  fillOrder: FillOrderModal | undefined;
  setFillOrder: (e: SetStateAction<FillOrderModal | undefined>) => void;
  setSellOrder: (e: SetStateAction<SellOrderModal | undefined>) => void;
  stats: HeaderStats;
  setStats: (e: SetStateAction<HeaderStats>) => void;
  minValues: {
    stake: number;
    bpsMin: number;
    bpsMax: number;
  };
  setMinValues: (
    e: SetStateAction<{
      stake: number;
      bpsMin: number;
      bpsMax: number;
    }>
  ) => void;
  type: number;
  setType: (e: SetStateAction<number>) => void;
  dragBox: boolean;
  setDragBox: (e: SetStateAction<boolean>) => void;
}

export interface HeaderStats {
  mona: number;
  ionic: number;
  genesis: number;
  blockTimestamp?: number;
}

export interface OpenContractModal {
  childId: number;
  orderId: number;
  maxAmount: number;
  childContract: string;
  originalMarket: string;
  estimatedDeliveryDuration: number;
  allContracts: FutureContract[];
}

export interface SellOrderModal {
  orderId: number;
  supply?: boolean;
  maxQuantity: number;
  tokenId: string;
  contractTitle: string;
  contractImage: string;
}

export interface FillOrderModal {
  orderId: number;
  maxQuantity: number;
  supply?: boolean;
  contractTitle: string;
  contractImage: string;
  pricePerUnit: number;
}

export interface SellOrderSupplyModal {
  childContract: string;
  childId: string;
  childTitle: string;
  childImage: string;
}
