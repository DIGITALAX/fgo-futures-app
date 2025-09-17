import { gql } from "@apollo/client";
import { graphFGOFuturesClient } from "../clients/graphql";

const ESCROWED_RIGHTS_BUYER = `
query($depositor: String!) {
  escrowedRights(orderBy: blockTimestamp, orderDirection: desc, where: { depositor: $depositor }) {
    rightsKey
    depositor
    childContract
    originalMarket
    childId
    orderId
    amount
    blockNumber
    blockTimestamp
    amountUsedForFutures
    transactionHash
    depositedAt
    futuresCreated
  }
}
`;

export const getEscrowedRightsBuyer = async (depositor: string): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(ESCROWED_RIGHTS_BUYER),
    variables: {
      depositor,
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



const ESCROWED_RIGHTS_ALL = `
query {
  escrowedRights(orderBy: blockTimestamp, orderDirection: desc) {
    rightsKey
    depositor
    childContract
    originalMarket
    childId
    orderId
    amount
    blockNumber
    blockTimestamp
    amountUsedForFutures
    transactionHash
    depositedAt
    futuresCreated
  }
}
`;

export const getEscrowedRightsAll = async (): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(ESCROWED_RIGHTS_ALL),
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
