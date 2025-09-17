import { SetStateAction } from "react";

export interface FuturesSimulationElement {
  id: string;
  name: string;
  image: string;
  price: number;
  position: {
    row: number;
    col: number;
  };
  isTrading?: boolean;
  lastTradeTime?: number;
}

export interface GridDimensions {
  cols: number;
  rows: number;
}

export interface PhysicalRight {
  childId: string;
  orderId: string;
  holder: string;
  buyer: string;
  child: {
    uri: string;
    childContract: string;
    physicalPrice: string;
    metadata: {
      image: string;
      title: string;
    };
  };
  order: {
    orderStatus: string;
    fulfillment: {
      currentStep: string;
      createdAt: string;
      lastUpdated: string;
      fulfillmentOrderSteps: {
        notes: string;
        completedAt: string;
        stepIndex: string;
        isCompleted: string;
      };
    };
    parent: {
      designId: string;
      parentContract: string;
      uri: string;
      workflow: {
        physicalSteps: {
          instructions: string;
          subPerformers: {
            performer: string;
            splitBasisPoints: string;
          };
          fulfiller: {
            fulfillerId: string;
            fulfiller: string;
            infraId: string;
            uri: string;
            metadata: {
              image: string;
              title: string;
              link: string;
            };
          };
        };
      };
      metadata: {
        title: string;
        image: string;
      };
    };
  };
  guaranteedAmount: string;
  purchaseMarket: string;
}

export interface Order {
  orderId: string;
  tokenId: string;
  quantity: string;
  pricePerUnit: string;
  seller: string;
  blockNumber: string;
  blockTimestamp: string;
  filledPrice: string;
  contract: {
    uri: string;
    metadata: {
      image: string;
      title: string;
    };
  };
  filledQuantity: string;
  transactionHash: string;
  isActive: boolean;
  filled: boolean;
  filler: string;
  protocolFee: string;
  lpFee: string;
}

export interface SettlementBot {
  stakeAmount: string;
  bot: string;
  totalSettlements: string;
  averageDelaySeconds: string;
  monaStaked: string;
  totalSlashEvents: string;
  totalAmountSlashed: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  settledContracts: {
    contractId: string;
    reward: string;
    settlementBot: string;
    actualCompletionTime: string;
    blockTimestamp: string;
    transactionHash: string;
    blockNumber: string;
    contract: {
      pricePerUnit: string;
      child: string;
      uri: string;
      physicalPrice: string;
      metadata: {
        title: string;
        image: string;
      };
    };
  }[];
}

export interface ContractSettled {
  contractId: string;
  reward: string;
  settlementBot: {
    stakeAmount: string;
    totalSettlements: string;
    averageDelaySeconds: string;
    totalSlashEvents: string;
    totalAmountSlashed: string;
  };
  actualCompletionTime: string;
  blockTimestamp: string;
  transactionHash: string;
  blockNumber: string;
  settler: string;
  emergency: string;
  contract: {
    pricePerUnit: string;
    child: {
      uri: string;
      physicalPrice: string;
      metadata: {
        title: string;
        image: string;
      };
    };
  };
}

export interface EscrowedRight {
  rightsKey: string;
  depositor: string;
  childContract: string;
  originalMarket: string;
  childId: string;
  orderId: string;
  amount: string;
  blockNumber: string;
  blockTimestamp: string;
  amountUsedForFutures: string;
  transactionHash: string;
  depositedAt: string;
  futuresCreated: boolean;
}

export interface CoreContractAddresses {
  futures: `0x${string}`;
  escrow: `0x${string}`;
  child: `0x${string}`;
  dlta: `0x${string}`;
  trading: `0x${string}`;
  genesis: `0x${string}`;
  mona: `0x${string}`;
  settlement: `0x${string}`;
}

export type TransferProps = {
  physicalRights: PhysicalRight[];
  physicalLoading: boolean;
  physicalUserLoading: boolean;
  physicalRightsUser: PhysicalRight[];
  dict: any;
};

export type EscrowProps = {
  handleDepositPhysicalRights: (chosenRights: {
    childId: number;
    orderId: number;
    amount: number;
    originalMarket: string;
    childContract: string;
  }) => Promise<void>;
  dict: any;
  depositLoading: boolean;
  physicalRightsEscrowed: PhysicalRight[];
  physicalEscrowedLoading: boolean;
  physicalUserEscrowedLoading: boolean;
  physicalRightsUserEscrowed: PhysicalRight[];
};

export type CreateProps = {
  handleWithdrawPhysicalRights: (chosenRights: {
    childId: number;
    orderId: number;
    amount: number;
    originalMarket: string;
    childContract: string;
  }) => Promise<void>;
  dict: any;
  escrowLoading: boolean;
  escrowUserLoading: boolean;
  escrowedRights: EscrowedRight[];
  escrowedRightsUser: EscrowedRight[];
  withdrawLoading: boolean;
};

export type OrderProps = {
  dict: any;
  handleCancelFuture: (contractId: number) => Promise<void>;
  orderCancelLoading: boolean;
  orderFillLoading: boolean;
  sellOrderLoading: boolean;
  futureCancelLoading: boolean;
  handleSellOrder: (orderId: number, quantity: number) => Promise<void>;
  handleFillOrder: (orderId: number, quantity: number) => Promise<void>;
  handleCancelOrder: (orderId: number) => Promise<void>;
};

export interface FutureContract {
  contractId: string;
  childId: string;
  orderId: string;
  quantity: string;
  uri: string;
  metadata: {
    image: string;
    title: string;
  };
  pricePerUnit: string;
  childContract: string;
  originalHolder: string;
  originalMarket: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  createdAt: string;
  settledAt: string;
  settlementRewardBPS: string;
  isActive: boolean;
  isSettled: boolean;
  trustedSettlementBots: {
    stakeAmount: string;
    bot: string;
    totalSettlements: string;
    averageDelaySeconds: string;
    totalSlashEvents: string;
    totalAmountSlashed: string;
  };
  child: {
    uri: string;
    physicalPrice: string;
    metadata: {
      title: string;
      image: string;
    };
  };
}

export interface OpenContractForm {
  childId: number;
  orderId: number;
  amount: number;
  pricePerUnit: number;
  settlementRewardBPS: number;
  childContract: string;
  originalMarket: string;
  trustedSettlementBots: string[];
  image: string;
  title: string;
}
