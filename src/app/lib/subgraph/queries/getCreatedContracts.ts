import { gql } from "@apollo/client";
import { graphFGOFuturesClient } from "../clients/graphql";

const FUTURE_CONTRACTS_BUYER = `
query($buyer: String!) {
  futureContracts(orderBy: blockTimestamp, orderDirection: desc, where: { buyer: $buyer }) {
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
  }
}
`;

export const getFutureContractsBuyer = async (buyer: string): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(FUTURE_CONTRACTS_BUYER),
    variables: {
      buyer,
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

const FUTURE_CONTRACTS_ALL = `
query {
  futureContracts(orderBy: blockTimestamp, orderDirection: desc)) {
    contractId
    childId
    orderId
    quantity
    uri
    metadata {
      image
      title
    }
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
  }
}
`;

export const getFutureContractsAll = async (): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(FUTURE_CONTRACTS_ALL),
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
