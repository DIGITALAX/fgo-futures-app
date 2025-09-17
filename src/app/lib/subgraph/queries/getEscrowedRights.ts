import { gql } from "@apollo/client";
import { graphFGOFuturesClient } from "../clients/graphql";

const ESCROWED_RIGHTS_BUYER = `
query($depositor: String!, $first: Int!, $skip: Int!) {
  escrowedRights(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip, where: { depositor: $depositor }) {
    rightsKey
    depositor
    childContract
    originalMarket
    childId
    orderId
    amount
    child {
      uri
      metadata {
        title
        image
      }
    }
    blockNumber
    blockTimestamp
    amountUsedForFutures
    transactionHash
    depositedAt
    futuresCreated
  }
}
`;

export const getEscrowedRightsBuyer = async (
  depositor: string,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(ESCROWED_RIGHTS_BUYER),
    variables: {
      depositor,
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

const ESCROWED_RIGHTS_ALL = `
query($first: Int!, $skip: Int!) {
  escrowedRights(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
    rightsKey
    depositor
    childContract
    originalMarket
    childId
    orderId
    amount
    blockNumber
    child {
      uri
      metadata {
        title
        image
      }
    }
    blockTimestamp
    amountUsedForFutures
    transactionHash
    depositedAt
    futuresCreated
  }
}
`;

export const getEscrowedRightsAll = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(ESCROWED_RIGHTS_ALL),
    fetchPolicy: "no-cache",
    variables: {
      first,
      skip,
    },
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
