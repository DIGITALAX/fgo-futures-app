import FGOFuturesContract from "./FGOFuturesContract.json";
import FGOFuturesEscrow from "./FGOFuturesEscrow.json";
import FGOFuturesSettlement from "./FGOFuturesSettlement.json";
import FGOFuturesTrading from "./FGOFuturesTrading.json";
import FGOChild from "./FGOChild.json";

export const ABIS = {
  FGOFuturesSettlement,
  FGOFuturesContract,
  FGOFuturesEscrow,
  FGOFuturesTrading,
  FGOChild,
} as const;

export const getABI = (contractName: keyof typeof ABIS) => {
  return ABIS[contractName];
};
