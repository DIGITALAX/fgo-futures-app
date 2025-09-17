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
}

export interface OpenContractModal {
  childId: number;
  orderId: number;
  maxAmount: number;
  childContract: string;
  originalMarket: string;
}
