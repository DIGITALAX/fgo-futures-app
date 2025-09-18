import { gql } from "@apollo/client";
import { graphFGOFuturesClient } from "../clients/graphql";

const SETTLEMENT_BUYER = `
query($bot: String!) {
  settlementBots(orderBy: blockTimestamp, orderDirection: desc, where: { bot: $bot }) {
    stakeAmount
    bot
    totalSettlements
    averageDelaySeconds
    stakeAmount
    totalSlashEvents
    totalAmountSlashed
    blockNumber
    blockTimestamp
    transactionHash
    settledContracts {
        contractId
        reward
        settlementBot
        actualCompletionTime
        blockTimestamp
        transactionHash
        blockNumber
        contract {
            pricePerUnit
            quantity
            settlementRewardBPS
            child {
              uri
              physicalPrice
              metadata {
                  title
                  image
              }
            }
        }
    }
  }
}
`;

export const getSettlementBotsUser = async (bot: string): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(SETTLEMENT_BUYER),
    variables: {
      bot,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

const SETTLEMENT_ALL = `
query($first: Int!, $skip: Int!) {
  settlementBots(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
    stakeAmount
    bot
    totalSettlements
    averageDelaySeconds
    stakeAmount
    totalSlashEvents
    totalAmountSlashed
    blockNumber
    blockTimestamp
    transactionHash
    settledContracts {
        contractId
        reward
        actualCompletionTime
        blockTimestamp
        transactionHash
        blockNumber
        contract {
            pricePerUnit
            quantity
            settlementRewardBPS
            child {
            uri
            physicalPrice
            metadata {
                title
                image
            }
            }
        }
    }
  }
}
`;

export const getSettlementBotsAll = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(SETTLEMENT_ALL),
    variables: { first, skip },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

const CONTRACTS_ALL = `
query($first: Int!, $skip: Int!) {
  futuresContracts(orderBy: blockTimestamp, orderDirection: desc, where: {lastUpdate_gt: 0}, first: $first, skip: $skip) {
    contractId
    childId
    orderId
    quantity
    pricePerUnit
    childContract
    originalHolder
    originalMarket
    blockNumber
    blockTimestamp
    transactionHash
    createdAt
    settledAt
    settlementRewardBPS
    isActive
    isSettled
    uri
    finalFillers
    timeSinceCompletion
    maxSettlementDelay
    metadata {
      image
      title
    }
    trustedSettlementBots {
        stakeAmount
        bot
        totalSettlements
        averageDelaySeconds
        totalSlashEvents
        totalAmountSlashed
    }
    child {
        uri
        physicalPrice
        metadata {
            title
            image
        }
    }
    settledContract {
    contractId
    reward
    settlementBot {
      stakeAmount
      totalSettlements
      averageDelaySeconds
      totalSlashEvents
      totalAmountSlashed
    }
    actualCompletionTime
    blockTimestamp
    transactionHash
    blockNumber
    settler
    emergency  
    }     
  }
}
`;

export const getContractsSettled = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(CONTRACTS_ALL),
    variables: {
      first,
      skip,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
