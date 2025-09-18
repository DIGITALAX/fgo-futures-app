export interface FuturesSimulationElement {
  metadata: {
    title: string;
    image: string;
  };
  physicalPrice: number;
  childId: string;
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

export interface Fulfiller {
  fulfillerId: string;
  fulfiller: string;
  infraId: string;
  uri: string;
  metadata: {
    image: string;
    title: string;
    link: string;
  };
  childOrders: ChildOrder[];
}

export interface PhysicalRight {
  childId: string;
  orderId: string;
  holder: string;
  originalBuyer: string;
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
  guaranteedAmount: string;
  purchaseMarket: string;
}

export interface Order {
  orderId: string;
  tokenId: string;
  balanceOf: number;
  quantity: string;
  pricePerUnit: string;
  seller: string;
  blockNumber: string;
  blockTimestamp: string;
  filledPrice: string;
  contract: {
    originalHolder: string;
    isSettled: boolean;
    uri: string;
    metadata: {
      image: string;
      title: string;
    };
    escrowed: {
      amountUsedInFutures: string;
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
  stakeAmount: string;
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
  childId: string;
  orderId: string;
  quantity: string;
  uri: string;
  metadata: {
    image: string;
    title: string;
  };
  finalFillers: string[];
  timeSinceCompletion: string;
  maxSettlementDelay: string;
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
  settledContract: {
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
  child: {
    uri: string;
    metadata: {
      image: string;
      title: string;
    };
  };
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
  simChild: `0x${string}`;
}

export type TransferProps = {
  physicalRights: PhysicalRight[];
  physicalLoading: boolean;
  physicalUserLoading: boolean;
  physicalRightsUser: PhysicalRight[];
  hasMorePhysicalRights: boolean;
  hasMorePhysicalRightsUser: boolean;
  loadMorePhysicalRights: () => void;
  loadMorePhysicalRightsUser: () => void;
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
  hasMorePhysicalRightsEscrowed: boolean;
  hasMorePhysicalRightsUserEscrowed: boolean;
  loadMorePhysicalRightsEscrowed: () => void;
  loadMorePhysicalRightsUserEscrowed: () => void;
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
  hasMoreEscrowedRights: boolean;
  hasMoreEscrowedRightsUser: boolean;
  loadMoreEscrowedRights: () => void;
  loadMoreEscrowedRightsUser: () => void;
};

export type OrderProps = {
  dict: any;
  orderCancelLoading: boolean;
  handleCancelFuture: (contractId: number) => Promise<void>;
  futureCancelLoading: boolean;
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
  timeSinceCompletion: string;
  maxSettlementDelay: string;
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
  image?: File;
  title: string;
}

export interface ChildOrder {
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
        fulfiller: Fulfiller;
      };
    };
    metadata: {
      title: string;
      image: string;
    };
  };
}
