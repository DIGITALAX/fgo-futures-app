// TEMPORARY FILE FOR UI TESTING - TO BE DISCARDED LATER
import {
  ContractSettled,
  Order,
  EscrowedRight,
  PhysicalRight,
  SettlementBot,
  FutureContract,
  Fulfiller,
} from "@/app/components/Layout/types/layout.types";

export const dummyContractsSettled: ContractSettled[] = [
  {
    contractId: "1",
    childId: "10",
    orderId: "5",
    quantity: "3",
    uri: "ipfs://QmTest1",
    metadata: {
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
      title: "Ethereal Silk Kimono",
    },
    finalFillers: ["0xd2dA1a02403125c0DE8BC23417DeA9e6f09eD89a"],
    timeSinceCompletion: "1703875000",
    maxSettlementDelay: "300", // 5 minutes
    pricePerUnit: "75000000000000000000", // 75 MONA
    childContract: "0x1111111111111111111111111111111111111111",
    originalHolder: "0xd2dA1a02403125c0DE8BC23417DeA9e6f09eD89a",
    originalMarket: "0x2222222222222222222222222222222222222222",
    blockNumber: "18750000",
    blockTimestamp: "1703875200",
    transactionHash: "0xabc123def456789",
    createdAt: "1703875000",
    settledAt: "1703875200",
    settlementRewardBPS: "250", // 2.5%
    isActive: false,
    isSettled: true,
    trustedSettlementBots: {
      stakeAmount: "1000000000000000000000", // 1000 MONA
      bot: "0x3333333333333333333333333333333333333333",
      totalSettlements: "45",
      averageDelaySeconds: "180",
      totalSlashEvents: "2",
      totalAmountSlashed: "50000000000000000000", // 50 MONA
    },
    child: {
      uri: "ipfs://QmTest1",
      physicalPrice: "100000000000000000000", // 100 MONA
      metadata: {
        title: "Ethereal Silk Kimono",
        image:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
      },
    },
    settledContract: {
      contractId: "1",
      reward: "150000000000000000000", // 150 MONA
      settlementBot: {
        stakeAmount: "1000000000000000000000", // 1000 MONA
        totalSettlements: "45",
        averageDelaySeconds: "180",
        totalSlashEvents: "2",
        totalAmountSlashed: "50000000000000000000", // 50 MONA
      },
      actualCompletionTime: "1703875200000",
      blockTimestamp: "1703875200",
      transactionHash: "0xabc123def456789",
      blockNumber: "18750000",
      settler: "0x1234567890abcdef1234567890abcdef12345678",
      emergency: "false",
    },
  },
  {
    contractId: "2",
    childId: "11",
    orderId: "6",
    quantity: "1",
    uri: "ipfs://QmTest2",
    metadata: {
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
      title: "Carbon Fiber Jacket",
    },
    finalFillers: ["0x70997970c51812dc3a010c7d01b50e0d17dc79c8"],
    timeSinceCompletion: "1703861500", // Earlier time
    maxSettlementDelay: "600", // 10 minutes
    pricePerUnit: "120000000000000000000", // 120 MONA
    childContract: "0x4444444444444444444444444444444444444444",
    originalHolder: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    originalMarket: "0x5555555555555555555555555555555555555555",
    blockNumber: "18749850",
    blockTimestamp: "1703861800",
    transactionHash: "0xdef456abc789123",
    createdAt: "1703861500",
    settledAt: "1703861800",
    settlementRewardBPS: "500", // 5%
    isActive: false,
    isSettled: true,
    trustedSettlementBots: {
      stakeAmount: "2000000000000000000000", // 2000 MONA
      bot: "0x6666666666666666666666666666666666666666",
      totalSettlements: "89",
      averageDelaySeconds: "120",
      totalSlashEvents: "0",
      totalAmountSlashed: "0",
    },
    child: {
      uri: "ipfs://QmTest2",
      physicalPrice: "180000000000000000000", // 180 MONA
      metadata: {
        title: "Carbon Fiber Jacket",
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
      },
    },
    settledContract: {
      contractId: "2",
      reward: "200000000000000000000", // 200 MONA
      settlementBot: {
        stakeAmount: "2000000000000000000000", // 2000 MONA
        totalSettlements: "89",
        averageDelaySeconds: "120",
        totalSlashEvents: "0",
        totalAmountSlashed: "0",
      },
      actualCompletionTime: "1703861800000",
      blockTimestamp: "1703861800",
      transactionHash: "0xdef456abc789123",
      blockNumber: "18749850",
      settler: "0x9876543210fedcba9876543210fedcba98765432",
      emergency: "true",
    },
  },
  {
    contractId: "3",
    childId: "12",
    orderId: "7",
    quantity: "2",
    uri: "ipfs://QmTest3",
    metadata: {
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop",
      title: "Quantum Mesh Hoodie",
    },
    finalFillers: ["0xd2dA1a02403125c0DE8BC23417DeA9e6f09eD89a"],
    timeSinceCompletion: String(Math.floor(Date.now() / 1000) - 900),
    maxSettlementDelay: "600",
    pricePerUnit: "90000000000000000000",
    childContract: "0x7777777777777777777777777777777777777777",
    originalHolder: "0xd2dA1a02403125c0DE8BC23417DeA9e6f09eD89a",
    originalMarket: "0x8888888888888888888888888888888888888888",
    blockNumber: "18749900",
    blockTimestamp: String(Math.floor(Date.now() / 1000) - 600),
    transactionHash: "0x333444555666777",
    createdAt: String(Math.floor(Date.now() / 1000) - 900),
    settledAt: "0",
    settlementRewardBPS: "300",
    isActive: true,
    isSettled: false,
    trustedSettlementBots: {
      stakeAmount: "1500000000000000000000",
      bot: "0x9999999999999999999999999999999999999999",
      totalSettlements: "23",
      averageDelaySeconds: "200",
      totalSlashEvents: "1",
      totalAmountSlashed: "25000000000000000000",
    },
    child: {
      uri: "ipfs://QmTest3",
      physicalPrice: "150000000000000000000",
      metadata: {
        title: "Quantum Mesh Hoodie",
        image:
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop",
      },
    },
    settledContract: {
      contractId: "3",
      reward: "0",
      settlementBot: {
        stakeAmount: "0",
        totalSettlements: "0",
        averageDelaySeconds: "0",
        totalSlashEvents: "0",
        totalAmountSlashed: "0",
      },
      actualCompletionTime: "0",
      blockTimestamp: "0",
      transactionHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      blockNumber: "0",
      settler: "0x0000000000000000000000000000000000000000",
      emergency: "false",
    },
  },
];

export const dummyOrders: Order[] = [
  {
    orderId: "101",
    tokenId: "5",
    balanceOf: 0, // No balance for selling
    quantity: "3",
    pricePerUnit: "80000000000000000000", // 80 MONA
    seller: "0xd2dA1a02403125c0DE8BC23417DeA9e6f09eD89a", // Common test address for cancel button
    blockNumber: "18750100",
    blockTimestamp: "1703876400",
    filledPrice: "0",
    contract: {
      originalHolder: "0xd2dA1a02403125c0DE8BC23417DeA9e6f09eD89a",
      isSettled: false,
      uri: "ipfs://QmOrderTest1",
      metadata: {
        image:
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop",
        title: "Quantum Mesh Hoodie",
      },
      escrowed: {
        amountUsedInFutures: "0",
      },
    },
    filledQuantity: "0",
    transactionHash: "0x111222333444555",
    isActive: true,
    filled: false,
    filler: "0x0000000000000000000000000000000000000000",
    protocolFee: "2400000000000000000", // 2.4 MONA
    lpFee: "1600000000000000000", // 1.6 MONA
  },
  {
    orderId: "102",
    tokenId: "8",
    balanceOf: 1, // Has balance for selling
    quantity: "2",
    pricePerUnit: "250000000000000000000", // 250 MONA
    seller: "0xd2dA1a02403125c0DE8BC23417DeA9e6f09eD89a",
    blockNumber: "18750050",
    blockTimestamp: "1703875800",
    filledPrice: "500000000000000000000", // 500 MONA
    contract: {
      originalHolder: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
      isSettled: false,
      uri: "ipfs://QmOrderTest2",
      metadata: {
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=300&fit=crop",
        title: "Holographic Sneakers",
      },
      escrowed: {
        amountUsedInFutures: "1",
      },
    },
    filledQuantity: "2",
    transactionHash: "0x666777888999aaa",
    isActive: false,
    filled: true,
    filler: "0xd2dA1a02403125c0DE8BC23417DeA9e6f09eD89a", // Common test address for sell button
    protocolFee: "7500000000000000000", // 7.5 MONA
    lpFee: "5000000000000000000", // 5 MONA
  },
  {
    orderId: "103",
    tokenId: "12",
    balanceOf: 0, // No balance for selling
    quantity: "5",
    pricePerUnit: "150000000000000000000", // 150 MONA
    seller: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    blockNumber: "18750000",
    blockTimestamp: "1703875000",
    filledPrice: "0",
    contract: {
      originalHolder: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
      isSettled: false,
      uri: "ipfs://QmOrderTest3",
      metadata: {
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        title: "Neo Running Shoes",
      },
      escrowed: {
        amountUsedInFutures: "2",
      },
    },
    filledQuantity: "0",
    transactionHash: "0x333444555666777",
    isActive: true,
    filled: false,
    filler: "0x0000000000000000000000000000000000000000",
    protocolFee: "2250000000000000000", // 2.25 MONA
    lpFee: "1500000000000000000", // 1.5 MONA
  },
];

export const dummyEscrowedRights: EscrowedRight[] = [
  {
    rightsKey: "escrow_001",
    depositor: "0xd2dA1a02403125c0DE8BC23417DeA9e6f09eD89a", // Common test address
    childContract: "0x333444555666777888999aaabbbcccdddeeeaaa",
    originalMarket: "0x999aaabbbcccdddeeefffaaa111222333444555",
    childId: "12",
    orderId: "401",
    amount: "5",
    blockNumber: "18750200",
    blockTimestamp: "1703877000",
    amountUsedForFutures: "2",
    transactionHash: "0xescrow123456789",
    depositedAt: "1703877000000",
    futuresCreated: true,
    child: {
      uri: "ipfs://QmEscrowChild1",
      metadata: {
        image:
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&h=300&fit=crop",
        title: "Digital Art Collectible",
      },
    },
  },
  {
    rightsKey: "escrow_002",
    depositor: "0xd2dA1a02403125c0DE8BC23417DeA9e6f09eD89a", // Common test address
    childContract: "0x444555666777888999aaabbbcccdddeeefffaaa",
    originalMarket: "0xaaabbbcccdddeeefffaaa111222333444555666",
    childId: "25",
    orderId: "402",
    amount: "8",
    blockNumber: "18750150",
    blockTimestamp: "1703876700",
    amountUsedForFutures: "0",
    transactionHash: "0xescrow987654321",
    depositedAt: "1703876700000",
    futuresCreated: false,
    child: {
      uri: "ipfs://QmEscrowChild2",
      metadata: {
        image:
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop",
        title: "Virtual Reality Headset",
      },
    },
  },
];

export const dummyPhysicalRights: PhysicalRight[] = [
  {
    childId: "33",
    orderId: "501",
    holder: "0xccc333444555666777888999aaabbbcccdddeee",
    originalBuyer: "0xd2dA1a02403125c0DE8BC23417DeA9e6f09eD89a", // Common test address
    buyer: "0xccc333444555666777888999aaabbbcccdddeee",
    child: {
      uri: "ipfs://QmPhysical1",
      childContract: "0x555666777888999aaabbbcccdddeeefffaaa111",
      physicalPrice: "95000000000000000000", // 95 MONA
      metadata: {
        image:
          "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=300&fit=crop",
        title: "Biometric Smart Watch",
      },
    },

    guaranteedAmount: "4",
    purchaseMarket: "0xbbbcccdddeeefffaaa111222333444555666777",
  },
  {
    childId: "44",
    orderId: "502",
    holder: "0xddd444555666777888999aaabbbcccdddeeeaaa",
    originalBuyer: "0xd2dA1a02403125c0DE8BC23417DeA9e6f09eD89a", // Common test address
    buyer: "0xddd444555666777888999aaabbbcccdddeeeaaa",
    child: {
      uri: "ipfs://QmPhysical2",
      childContract: "0x666777888999aaabbbcccdddeeefffaaa111222",
      physicalPrice: "320000000000000000000", // 320 MONA
      metadata: {
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
        title: "Luxury Leather Handbag",
      },
    },

    guaranteedAmount: "2",
    purchaseMarket: "0xcccdddeeefffaaa111222333444555666777888",
  },
];

export const dummySettlementBots: SettlementBot[] = [
  {
    stakeAmount: "5000000000000000000000", // 5000 MONA
    bot: "0xbot111222333444555666777888999aaabbbccc",
    totalSettlements: "234",
    averageDelaySeconds: "95",
    monaStaked: "5000000000000000000000",
    totalSlashEvents: "1",
    totalAmountSlashed: "100000000000000000000", // 100 MONA
    blockNumber: "18745000",
    blockTimestamp: "1703850000",
    transactionHash: "0xbot123456789abc",
    settledContracts: [
      {
        contractId: "10",
        reward: "125000000000000000000", // 125 MONA
        settlementBot: "0xbot111222333444555666777888999aaabbbccc",
        actualCompletionTime: "1703870000000",
        blockTimestamp: "1703870000",
        transactionHash: "0xsettled123abc",
        blockNumber: "18749000",
        contract: {
          pricePerUnit: "85000000000000000000", // 85 MONA
          child: "child_ref_001",
          uri: "ipfs://QmContract1",
          physicalPrice: "110000000000000000000", // 110 MONA
          metadata: {
            title: "Neural Interface Headset",
            image:
              "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&h=300&fit=crop",
          },
        },
      },
    ],
  },
  {
    stakeAmount: "8000000000000000000000", // 8000 MONA
    bot: "0xbot222333444555666777888999aaabbbcccddd",
    totalSettlements: "567",
    averageDelaySeconds: "72",
    monaStaked: "8000000000000000000000",
    totalSlashEvents: "0",
    totalAmountSlashed: "0",
    blockNumber: "18746000",
    blockTimestamp: "1703852000",
    transactionHash: "0xbot987654321def",
    settledContracts: [
      {
        contractId: "11",
        reward: "175000000000000000000", // 175 MONA
        settlementBot: "0xbot222333444555666777888999aaabbbcccddd",
        actualCompletionTime: "1703872000000",
        blockTimestamp: "1703872000",
        transactionHash: "0xsettled456def",
        blockNumber: "18749100",
        contract: {
          pricePerUnit: "140000000000000000000", // 140 MONA
          child: "child_ref_002",
          uri: "ipfs://QmContract2",
          physicalPrice: "200000000000000000000", // 200 MONA
          metadata: {
            title: "Augmented Reality Glasses",
            image:
              "https://images.unsplash.com/photo-1592659762303-90081d34b277?w=300&h=300&fit=crop",
          },
        },
      },
      {
        contractId: "12",
        reward: "200000000000000000000", // 200 MONA
        settlementBot: "0xbot222333444555666777888999aaabbbcccddd",
        actualCompletionTime: "1703874000000",
        blockTimestamp: "1703874000",
        transactionHash: "0xsettled789ghi",
        blockNumber: "18749200",
        contract: {
          pricePerUnit: "95000000000000000000", // 95 MONA
          child: "child_ref_003",
          uri: "ipfs://QmContract3",
          physicalPrice: "130000000000000000000", // 130 MONA
          metadata: {
            title: "Smart Fabric Jacket",
            image:
              "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
          },
        },
      },
    ],
  },
  {
    stakeAmount: "12000000000000000000000", // 12000 MONA
    bot: "0xbot333444555666777888999aaabbbcccdddee",
    totalSettlements: "892",
    averageDelaySeconds: "45",
    monaStaked: "12000000000000000000000",
    totalSlashEvents: "2",
    totalAmountSlashed: "500000000000000000000", // 500 MONA
    blockNumber: "18744000",
    blockTimestamp: "1703840000",
    transactionHash: "0xbotabc123def456",
    settledContracts: [
      {
        contractId: "13",
        reward: "300000000000000000000", // 300 MONA
        settlementBot: "0xbot333444555666777888999aaabbbcccdddee",
        actualCompletionTime: "1703876000000",
        blockTimestamp: "1703876000",
        transactionHash: "0xsettledabc123",
        blockNumber: "18749300",
        contract: {
          pricePerUnit: "180000000000000000000", // 180 MONA
          child: "child_ref_004",
          uri: "ipfs://QmContract4",
          physicalPrice: "250000000000000000000", // 250 MONA
          metadata: {
            title: "Holographic Display Module",
            image:
              "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
          },
        },
      },
      {
        contractId: "14",
        reward: "150000000000000000000", // 150 MONA
        settlementBot: "0xbot333444555666777888999aaabbbcccdddee",
        actualCompletionTime: "1703878000000",
        blockTimestamp: "1703878000",
        transactionHash: "0xsettleddef456",
        blockNumber: "18749400",
        contract: {
          pricePerUnit: "120000000000000000000", // 120 MONA
          child: "child_ref_005",
          uri: "ipfs://QmContract5",
          physicalPrice: "160000000000000000000", // 160 MONA
          metadata: {
            title: "Bio-Sensor Wristband",
            image:
              "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=300&h=300&fit=crop",
          },
        },
      },
      {
        contractId: "15",
        reward: "250000000000000000000", // 250 MONA
        settlementBot: "0xbot333444555666777888999aaabbbcccdddee",
        actualCompletionTime: "1703880000000",
        blockTimestamp: "1703880000",
        transactionHash: "0xsettledghi789",
        blockNumber: "18749500",
        contract: {
          pricePerUnit: "200000000000000000000", // 200 MONA
          child: "child_ref_006",
          uri: "ipfs://QmContract6",
          physicalPrice: "300000000000000000000", // 300 MONA
          metadata: {
            title: "Quantum Computing Chip",
            image:
              "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
          },
        },
      },
    ],
  },
  {
    stakeAmount: "3000000000000000000000", // 3000 MONA
    bot: "0xbot444555666777888999aaabbbcccdddeeeff",
    totalSettlements: "45",
    averageDelaySeconds: "180",
    monaStaked: "3000000000000000000000",
    totalSlashEvents: "5",
    totalAmountSlashed: "1200000000000000000000", // 1200 MONA
    blockNumber: "18747000",
    blockTimestamp: "1703860000",
    transactionHash: "0xbotdef789ghi012",
    settledContracts: [
      {
        contractId: "16",
        reward: "80000000000000000000", // 80 MONA
        settlementBot: "0xbot444555666777888999aaabbbcccdddeeeff",
        actualCompletionTime: "1703882000000",
        blockTimestamp: "1703882000",
        transactionHash: "0xsettledjkl345",
        blockNumber: "18749600",
        contract: {
          pricePerUnit: "60000000000000000000", // 60 MONA
          child: "child_ref_007",
          uri: "ipfs://QmContract7",
          physicalPrice: "85000000000000000000", // 85 MONA
          metadata: {
            title: "Digital Art Canvas",
            image:
              "https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&h=300&fit=crop",
          },
        },
      },
    ],
  },
];

export const dummyFutureContracts: FutureContract[] = [
  {
    contractId: "future_001",
    childId: "15",
    orderId: "301",
    quantity: "3",
    uri: "ipfs://QmFuture1",
    metadata: {
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop",
      title: "Digital Fashion NFT Collection",
    },
    timeSinceCompletion: "1703865300",
    maxSettlementDelay: "300",
    pricePerUnit: "90000000000000000000", // 90 MONA
    childContract: "0xfuture111222333444555666777888999aaabbb",
    originalHolder: "0xholder111222333444555666777888999aaabbb",
    originalMarket: "0xmarket111222333444555666777888999aaabbb",
    blockNumber: "18748000",
    blockTimestamp: "1703865000",
    transactionHash: "0xfuture123456abc",
    createdAt: "1703865000000",
    settledAt: "0",
    settlementRewardBPS: "250", // 2.5%
    isActive: true,
    isSettled: false,
    trustedSettlementBots: {
      stakeAmount: "3000000000000000000000", // 3000 MONA
      bot: "0xbot111222333444555666777888999aaabbbccc",
      totalSettlements: "89",
      averageDelaySeconds: "110",
      totalSlashEvents: "0",
      totalAmountSlashed: "0",
    },
    child: {
      uri: "ipfs://QmChild1",
      physicalPrice: "120000000000000000000", // 120 MONA
      metadata: {
        title: "Smart Textile Jacket",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop",
      },
    },
  },
];

export const dummyFulfillers: Fulfiller[] = [
  {
    fulfillerId: "fulfiller_001",
    fulfiller: "0xfulfiller111222333444555666777888999aaa",
    infraId: "infra_textile_001",
    uri: "ipfs://QmFulfiller1",
    metadata: {
      image:
        "https://images.unsplash.com/photo-1556741533-f6acd5d2e401?w=300&h=300&fit=crop",
      title: "Luxury Textile Manufacturing Co.",
      link: "https://luxurytextile.example.com",
    },
    childOrders: [
      {
        orderStatus: "in_progress",
        fulfillment: {
          currentStep: "2",
          createdAt: "1703870000000",
          lastUpdated: "1703875000000",
          fulfillmentOrderSteps: {
            notes: "Fabric sourcing completed, moving to pattern cutting phase",
            completedAt: "1703875000000",
            stepIndex: "2",
            isCompleted: "false",
          },
        },
        parent: {
          designId: "design_luxury_001",
          parentContract: "0xparent111222333444555666777888999aaa",
          uri: "ipfs://QmParentLuxury1",
          workflow: {
            physicalSteps: {
              instructions:
                "Premium fabric selection and cutting with precision tools",
              subPerformers: {
                performer: "0xsub111222333444555666777888999aaa",
                splitBasisPoints: "750", // 7.5%
              },
              fulfiller: {
                fulfillerId: "fulfiller_002",
                fulfiller: "0xstepfulfiller111222333444555666777888",
                infraId: "infra_cutting_001",
                uri: "ipfs://QmStepFulfiller1",
                metadata: {
                  image:
                    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop",
                  title: "Precision Cutting Specialists",
                  link: "https://precisioncut.example.com",
                },
                childOrders: [],
              },
            },
          },
          metadata: {
            title: "Luxury Silk Evening Gown",
            image:
              "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
          },
        },
      },
      {
        orderStatus: "completed",
        fulfillment: {
          currentStep: "4",
          createdAt: "1703850000000",
          lastUpdated: "1703870000000",
          fulfillmentOrderSteps: {
            notes: "Quality inspection passed, ready for shipping",
            completedAt: "1703870000000",
            stepIndex: "4",
            isCompleted: "true",
          },
        },
        parent: {
          designId: "design_casual_001",
          parentContract: "0xparent222333444555666777888999bbb",
          uri: "ipfs://QmParentCasual1",
          workflow: {
            physicalSteps: {
              instructions:
                "Standard manufacturing process with quality controls",
              subPerformers: {
                performer: "0xsub222333444555666777888999bbb",
                splitBasisPoints: "500", // 5%
              },
              fulfiller: {
                fulfillerId: "fulfiller_003",
                fulfiller: "0xstepfulfiller222333444555666777888",
                infraId: "infra_assembly_001",
                uri: "ipfs://QmStepFulfiller2",
                metadata: {
                  image:
                    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
                  title: "Garment Assembly Works",
                  link: "https://assemblyworks.example.com",
                },
                childOrders: [],
              },
            },
          },
          metadata: {
            title: "Organic Cotton T-Shirt",
            image:
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
          },
        },
      },
    ],
  },
  {
    fulfillerId: "fulfiller_004",
    fulfiller: "0xfulfiller222333444555666777888999bbb",
    infraId: "infra_electronics_001",
    uri: "ipfs://QmFulfiller2",
    metadata: {
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
      title: "Smart Electronics Integration",
      link: "https://smartelectronics.example.com",
    },
    childOrders: [
      {
        orderStatus: "pending",
        fulfillment: {
          currentStep: "1",
          createdAt: "1703880000000",
          lastUpdated: "1703880000000",
          fulfillmentOrderSteps: {
            notes: "Awaiting component delivery from suppliers",
            completedAt: "0",
            stepIndex: "1",
            isCompleted: "false",
          },
        },
        parent: {
          designId: "design_wearable_001",
          parentContract: "0xparent333444555666777888999ccc",
          uri: "ipfs://QmParentWearable1",
          workflow: {
            physicalSteps: {
              instructions: "Integrate smart sensors and connectivity modules",
              subPerformers: {
                performer: "0xsub333444555666777888999ccc",
                splitBasisPoints: "1000", // 10%
              },
              fulfiller: {
                fulfillerId: "fulfiller_005",
                fulfiller: "0xstepfulfiller333444555666777888999",
                infraId: "infra_sensor_001",
                uri: "ipfs://QmStepFulfiller3",
                metadata: {
                  image:
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
                  title: "Sensor Integration Lab",
                  link: "https://sensorlab.example.com",
                },
                childOrders: [],
              },
            },
          },
          metadata: {
            title: "Smart Fitness Tracker Jacket",
            image:
              "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
          },
        },
      },
      {
        orderStatus: "in_progress",
        fulfillment: {
          currentStep: "3",
          createdAt: "1703860000000",
          lastUpdated: "1703878000000",
          fulfillmentOrderSteps: {
            notes: "Circuit testing in progress, 80% complete",
            completedAt: "0",
            stepIndex: "3",
            isCompleted: "false",
          },
        },
        parent: {
          designId: "design_ar_001",
          parentContract: "0xparent444555666777888999ddd",
          uri: "ipfs://QmParentAR1",
          workflow: {
            physicalSteps: {
              instructions:
                "Assembly of AR display components with precision alignment",
              subPerformers: {
                performer: "0xsub444555666777888999ddd",
                splitBasisPoints: "800", // 8%
              },
              fulfiller: {
                fulfillerId: "fulfiller_006",
                fulfiller: "0xstepfulfiller444555666777888999111",
                infraId: "infra_ar_001",
                uri: "ipfs://QmStepFulfiller4",
                metadata: {
                  image:
                    "https://images.unsplash.com/photo-1592659762303-90081d34b277?w=300&h=300&fit=crop",
                  title: "AR Display Systems",
                  link: "https://ardisplay.example.com",
                },
                childOrders: [],
              },
            },
          },
          metadata: {
            title: "Augmented Reality Glasses",
            image:
              "https://images.unsplash.com/photo-1592659762303-90081d34b277?w=300&h=300&fit=crop",
          },
        },
      },
      {
        orderStatus: "completed",
        fulfillment: {
          currentStep: "5",
          createdAt: "1703840000000",
          lastUpdated: "1703876000000",
          fulfillmentOrderSteps: {
            notes: "Final testing completed successfully, shipped to customer",
            completedAt: "1703876000000",
            stepIndex: "5",
            isCompleted: "true",
          },
        },
        parent: {
          designId: "design_neural_001",
          parentContract: "0xparent555666777888999eee",
          uri: "ipfs://QmParentNeural1",
          workflow: {
            physicalSteps: {
              instructions: "Neural interface calibration and safety testing",
              subPerformers: {
                performer: "0xsub555666777888999eee",
                splitBasisPoints: "1200", // 12%
              },
              fulfiller: {
                fulfillerId: "fulfiller_007",
                fulfiller: "0xstepfulfiller555666777888999222",
                infraId: "infra_neural_001",
                uri: "ipfs://QmStepFulfiller5",
                metadata: {
                  image:
                    "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&h=300&fit=crop",
                  title: "Neural Interface Technologies",
                  link: "https://neuraltech.example.com",
                },
                childOrders: [],
              },
            },
          },
          metadata: {
            title: "Neural Interface Headset",
            image:
              "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&h=300&fit=crop",
          },
        },
      },
    ],
  },
  {
    fulfillerId: "fulfiller_008",
    fulfiller: "0xfulfiller333444555666777888999ccc",
    infraId: "infra_sustainable_001",
    uri: "ipfs://QmFulfiller3",
    metadata: {
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
      title: "Sustainable Fashion Collective",
      link: "https://sustainablefashion.example.com",
    },
    childOrders: [
      {
        orderStatus: "in_progress",
        fulfillment: {
          currentStep: "2",
          createdAt: "1703875000000",
          lastUpdated: "1703881000000",
          fulfillmentOrderSteps: {
            notes:
              "Organic dye application in progress using eco-friendly methods",
            completedAt: "0",
            stepIndex: "2",
            isCompleted: "false",
          },
        },
        parent: {
          designId: "design_eco_001",
          parentContract: "0xparent666777888999fff",
          uri: "ipfs://QmParentEco1",
          workflow: {
            physicalSteps: {
              instructions:
                "Sustainable production with zero-waste methodology",
              subPerformers: {
                performer: "0xsub666777888999fff",
                splitBasisPoints: "600", // 6%
              },
              fulfiller: {
                fulfillerId: "fulfiller_009",
                fulfiller: "0xstepfulfiller666777888999333",
                infraId: "infra_dyeing_001",
                uri: "ipfs://QmStepFulfiller6",
                metadata: {
                  image:
                    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop",
                  title: "Eco-Friendly Dyeing Solutions",
                  link: "https://ecodye.example.com",
                },
                childOrders: [],
              },
            },
          },
          metadata: {
            title: "Eco-Friendly Hemp Hoodie",
            image:
              "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=300&fit=crop",
          },
        },
      },
    ],
  },
];
