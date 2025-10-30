import { SetStateAction } from "react";
import { SettlementBot } from "../../Layout/types/layout.types";

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
  hideError: () => void;
  successData: SuccessData | null;
  errorData: ErrorData | null;
  settlementBots: SettlementBot[];
  setSettlementBots: (e: SetStateAction<SettlementBot[]>) => void;
  openContract: OpenContractModal | undefined;
  setOpenContract: (e: SetStateAction<OpenContractModal | undefined>) => void;
  sellOrder: SellOrderModal | undefined;
  fillOrder: FillOrderModal | undefined;
  setFillOrder: (e: SetStateAction<FillOrderModal | undefined>) => void;
  setSellOrder: (e: SetStateAction<SellOrderModal | undefined>) => void;
  stats: HeaderStats;
  setStats: (e: SetStateAction<HeaderStats>) => void;
  minStake: number;
  setMinStake: (e: SetStateAction<number>) => void;
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
}

export interface SellOrderModal {
  orderId: number;
  maxQuantity: number;
  contractTitle: string;
  contractImage: string;
}

export interface FillOrderModal {
  orderId: number;
  maxQuantity: number;
  contractTitle: string;
  contractImage: string;
  pricePerUnit: number;
}
