import { gql } from "@apollo/client";
import { graphFGOFuturesClient } from "../clients/graphql";

const ORDERS_ALL = `
query($first: Int!, $skip: Int!) {
  orders(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
    id
    orderId
    tokenId
    quantity
    pricePerUnit
    seller
    blockNumber
    blockTimestamp
    filledPrice
    contract {
        uri
        originalHolder
        isSettled
        metadata {
            image
            title
        }
    }
    filledQuantity
    transactionHash
    isActive
    filled
    filler
    protocolFee
    lpFee
  }
}
`;

export const getOrdersAll = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(ORDERS_ALL),
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

const ORDERS_USER = `
query($user: String!, $first: Int!, $skip: Int!) {
  orders(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip, where: { or: [{seller: $user}, {filler: $user}] }) {
    id
    orderId
    tokenId
    quantity
    pricePerUnit
    seller
    blockNumber
    blockTimestamp
    filledPrice
    contract {
        uri
        originalHolder
        isSettled
        metadata {
            image
            title
        }
    }
    filledQuantity
    transactionHash
    isActive
    filled
    filler
    protocolFee
    lpFee
  }
}
`;

export const getOrdersUser = async (
  user: string,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(ORDERS_USER),
    variables: {
      user,
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
