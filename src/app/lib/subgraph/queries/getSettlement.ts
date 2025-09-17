import { gql } from "@apollo/client";
import { graphFGOFuturesClient } from "../clients/graphql";

const SETTLEMENT_BUYER = `
query($bot: String!) {
  settlementBots(orderBy: blockTimestamp, orderDirection: desc, where: { bot: $bot }) {
    stakeAmount
    bot
    totalSettlements
    averageDelaySeconds
    monaStaked
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
query {
  settlementBots(orderBy: blockTimestamp, orderDirection: desc) {
    stakeAmount
    bot
    totalSettlements
    averageDelaySeconds
    monaStaked
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

export const getSettlementBotsAll = async (): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(SETTLEMENT_ALL),
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
query {
  contractSettleds(orderBy: blockTimestamp, orderDirection: desc) {
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
    contract {
      pricePerUnit
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
`;

export const getContractsSettled = async (): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(CONTRACTS_ALL),
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
