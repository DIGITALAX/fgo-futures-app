export interface FuturesSimulationElement {
  metadata: {
    title: string;
    image: string;
  };
  physicalPrice: number;
  childId: string;
  childContract: string;
  futures?: { pricePerUnit: string };
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
  fulfiller: string;
  infraId: string;
  uri: string;
  metadata: {
    image: string;
    title: string;
    link: string;
  };
  fulfillments: Fulfillment[];
}

export interface Fulfillment {
  orderId: string;
  contract: string;
  parent: Parent;
  currentStep: string;
  createdAt: string;
  lastUpdated: string;
  isPhysical: boolean;
  order: {
    fulfillmentData: string;
    orderStatus: string;
    transactionHash: string;
    totalPayments: string;
    parentAmount: string;
  };
  estimatedDeliveryDuration: string;
  fulfillmentOrderSteps: FulfillmentOrderStep[];
  physicalSteps: PhysicalStep[];
}

export interface PhysicalStep {
  fulfiller: {
    fulfiller: string;
    uri: string;
    metadata: {
      image: string;
      title: string;
    };
  };
  instructions: string;
  subPerformers: SubPerformer[];
}

export interface Parent {
  parentContract: string;
  designId: string;
  allNested: GraphChild[];
  infraCurrency: string;
  uri: string;
  metadata: {
    title: string;
    image: string;
  };
}

export interface FulfillmentOrderStep {
  notes: string;
  completedAt: string;
  isCompleted: boolean;
  stepIndex: string;
}

export interface SubPerformer {
  splitBasisPoints: number;
  performer: string;
}

export interface FulfillmentStep {
  primaryPerformer: string;
  instructions: string;
  subPerformers: SubPerformer[];
  fulfiller?: Fulfiller;
}

export interface PhysicalRight {
  childId: string;
  orderId: string;
  holder: string;
  originalBuyer: string;
  buyer: string;
  blockTimestamp: string;
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
  estimatedDeliveryDuration: string;
  purchaseMarket: string;
}

export interface Order {
  orderId: string;
  quantity: string;
  pricePerUnit: string;
  seller: string;
  blockNumber: string;
  blockTimestamp: string;
  contract: {
    originalHolder: string;
    contractId: string;
    isSettled: boolean;
    uri: string;
    tokenId: string;
    metadata: {
      image: string;
      title: string;
    };
  };
  transactionHash: string;
  isActive: boolean;
  filled: boolean;
  fillers: Filler[];
  protocolFee: string;
  lpFee: string;
}

export interface Filler {
  price: string;
  quantity: string;
  filler: string;
  order: Order;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface SettlementBot {
  stakeAmount: string;
  bot: string;
  totalSettlements: string;
  averageDelaySeconds: string;
  totalSlashEvents: string;
  totalAmountSlashed: string;
  totalRewardSlashed: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  settledContracts: {
    contractId: string;
    reward: string;
    settlementBot: string;
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

export type Language = "en" | "es" | "fr" | "gd" | "pt" | "yi";

export interface ContractSettled {
  contractId: string;
  childId: string;
  tokenId: string;
  marketOrderId: string;
  isFulfilled: boolean;
  quantity: string;
  balanceOf?: number;
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
  fulfillerSettlement: string;
  futuresSettlementDate: string;
  trustedSettlementBots: {
    stakeAmount: string;
    bot: string;
    totalSettlements: string;
    averageDelaySeconds: string;
    totalSlashEvents: string;
    totalAmountSlashed: string;
  }[];
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
  contracts: FutureContract[];
  estimatedDeliveryDuration: string;
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
  futuresCoordination: `0x${string}`;
  ionic: `0x${string}`;
  trading: `0x${string}`;
  genesis: `0x${string}`;
  mona: `0x${string}`;
  settlement: `0x${string}`;
}

export type TabKey =
  | "all"
  | "my"
  | "allSells"
  | "allBuys"
  | "mySells"
  | "myBuys";

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
    key: string;
  }) => Promise<void>;
  dict: any;
  depositLoadingKey: string | null;
  physicalRightsEscrowed: PhysicalRight[];
  physicalEscrowedLoading: boolean;
  physicalUserEscrowedLoading: boolean;
  physicalRightsUserEscrowed: PhysicalRight[];
  hasMorePhysicalRightsEscrowed: boolean;
  hasMorePhysicalRightsUserEscrowed: boolean;
  loadMorePhysicalRightsEscrowed: () => void;
  loadMorePhysicalRightsUserEscrowed: () => void;
};

export interface Supplier {
  supplier: string;
  infraId: string;
  supplierId: string;
  uri: string;
  futures: {
    childId: string;
    childContract: string;
    uri: string;
    transactionHash: string;
    futures: {
      totalAmount: string;
    };
    metadata: {
      title: string;
      image: string;
    };
  }[];
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  isActive: boolean;
  version: string;
  metadata: {
    title: string;
    image: string;
    description: string;
    link: string;
  };
}

export type CreateProps = {
  handleWithdrawPhysicalRights: (chosenRights: RightsAction) => Promise<void>;
  dict: any;
  claimLoadingKey: string | null;
  escrowLoading: boolean;
  escrowUserLoading: boolean;
  escrowedRights: EscrowedRight[];
  escrowedRightsUser: EscrowedRight[];
  withdrawLoadingKey: string | null;
  hasMoreEscrowedRights: boolean;
  hasMoreEscrowedRightsUser: boolean;
  loadMoreEscrowedRights: () => void;
  loadMoreEscrowedRightsUser: () => void;
  handleCancelFuture: (contractId: number) => Promise<void>;
  claimUnusedRights: (chosenRights: RightsAction) => Promise<void>;
  loadingKeys: { [key: string]: boolean };
};

export type RightsAction = {
  childId: number;
  orderId: number;
  amount: number;
  originalMarket: string;
  childContract: string;
  key: string;
};

export type GraphChild = {
  childId: string;
  childContract: string;
  physicalPrice: string;
  futures: {
    pricePerUnit: string;
  };
  metadata?: {
    title?: string;
    image?: string;
  } | null;
  uri?: string | null;
  [key: string]: any;
};

export type OrderProps = {
  loadingKeys: { [key: string]: boolean };
  handleCancelOrder: (orderId: number) => Promise<void>;
  dict: any;
};

export type DragState = {
  pointerId: number | null;
  offsetX: number;
  offsetY: number;
  frameWidth: number;
  frameHeight: number;
  containerLeft: number;
  containerTop: number;
  containerWidth: number;
  containerHeight: number;
};

export type SupplyOrderProps = {
  dict: any;
};

export interface FutureContract {
  contractId: string;
  balanceOf?: number;
  tokenId: string;
  childId: string;
  marketOrderId: string;
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
  orders: Order[];
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
  }[];
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
      isCompleted: boolean;
    }[];
  };
  parent: {
    designId: string;
    parentContract: string;
    uri: string;
    workflow: {
      estimatedDeliveryDuration: string;
      physicalSteps: {
        instructions: string;
        subPerformers: {
          performer: string;
          splitBasisPoints: string;
        };
        fulfiller: Fulfiller;
      }[];
    };
    metadata: {
      title: string;
      image: string;
    };
  };
}

export interface FutureCredit {
  childContract: string;
  childId: string;
  child: GraphChild;
  tokenId: string;
  buyer: string;
  credits: string;
  consumed: string;
  position: SupplyFuture;
}

export interface SupplyFuture {
  supplier: string;
  tokenId: string;
  supplierProfile?: {
    metadata?: {
      title?: string;
    };
  };
  pricePerUnit: string;
  deadline: string;
  isSettled: boolean;
  totalAmount: string;
  soldAmount: string;
  isActive: boolean;
  settlementRewardBPS: string;
  child: {
    childId: string;
    childContract: string;
    infraCurrency: string;
    metadata?: {
      title?: string;
      image?: string;
    };
  };
  blockTimestamp: string;
  isClosed: boolean;
  closed: boolean;
  closedBlockNumber: string;
  closedBlockTimestamp: string;
  closedTransactionHash: string;
  settler: string;
  settlementReward: string;
  settlementBlockNumber: string;
  settlementBlockTimestamp: string;
  settlementTransactionHash: string;
  purchases: PurchaseRecord[];
  sellOrders: SellOrder[];
  settlements: Settlement[];
  balanceOf?: number;
  reservedAmount?: number;
}

export interface Settlement {
  future: SupplyFuture;
  buyer: string;
  credits: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface PurchaseRecord {
  amount: string;
  totalCost: string;
  buyer: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  future: SupplyFuture;
  order: SellOrder;
}

export interface SellOrder {
  future: SupplyFuture;
  seller: string;
  amount: string;
  pricePerUnit: string;
  orderId: string;
  isActive: boolean;
  isClosed: boolean;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  protocolFee: string;
  lpFee: string;
  fillers: PurchaseRecord[];
  filled: boolean;
}
