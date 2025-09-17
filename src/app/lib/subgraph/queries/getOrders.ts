import { gql } from "@apollo/client";
import { graphFGOFuturesClient } from "../clients/graphql";

const ORDERS_ALL = `
query {
  orders(orderBy: blockTimestamp, orderDirection: desc) {
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

export const getOrdersAll = async (): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(ORDERS_ALL),
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
query($user: String!) {
  orders(orderBy: blockTimestamp, orderDirection: desc, where: { or: [{seller: $user}, {filler: $user}] }) {
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

export const getOrdersUser = async (user: string): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(ORDERS_USER),
    variables: {
      user,
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
