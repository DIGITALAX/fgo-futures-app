import { gql } from "@apollo/client";
import { graphFGOFuturesClient , graphFGOClient} from "../clients/graphql";

const ORDERS_ALL = `
query($first: Int!, $skip: Int!) {
  orders(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
    id
    orderId
    quantity
    pricePerUnit
    seller
    blockNumber
    blockTimestamp
    contract {
        contractId
        uri
        tokenId
        originalHolder
        isSettled
        metadata {
            image
            title
        }
    }
    transactionHash
    isActive
    filled
    fillers {
      filler
      quantity
      price
      blockNumber
      blockTimestamp
      transactionHash
    }
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
  orders(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip, where: {seller: $user}) {
    id
    orderId
    quantity
    pricePerUnit
    seller
    blockNumber
    blockTimestamp
    contract {
        contractId
        uri
        tokenId
        originalHolder
        isSettled
        metadata {
            image
            title
        }
    }
    transactionHash
    isActive
    filled
    fillers {
      filler
      quantity
      price
      blockNumber
      blockTimestamp
      transactionHash
    }
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

const ORDERS_USER_FILLED = `
query($filler: String!, $first: Int!, $skip: Int!) {
  fillers(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip, where: {filler: $filler}) {
      filler
      quantity
      price
      blockNumber
      blockTimestamp
      transactionHash
      order {
        id
    orderId
    quantity
    pricePerUnit
    seller
    blockNumber
    blockTimestamp
    contract {
        contractId
        uri
        tokenId
        originalHolder
        isSettled
        metadata {
            image
            title
        }
    }
      transactionHash
      isActive
      filled
      protocolFee
      lpFee
    }
  }
}
`;

export const getOrdersUserFilled = async (
  filler: string,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(ORDERS_USER_FILLED),
    variables: {
      filler,
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

const ORDERS_USER_SUPPLY = `
query($seller: String!, $first: Int!, $skip: Int!) {
  sellOrders(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip, where: {seller: $seller}) {
    seller
    amount
    pricePerUnit
    orderId
    isActive
    isClosed
    blockNumber
    blockTimestamp
    transactionHash
    protocolFee
    lpFee
    future {
      tokenId
      supplier
      totalAmount
      soldAmount
      pricePerUnit
      settlementRewardBPS
      deadline
      isSettled
      isActive
      isClosed
      child {
        uri
        childId
        childContract
        metadata {
          title
          image
        }
      }
    }
    fillers {
      amount
      totalCost
      buyer
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
}
`;

export const getOrdersSupplyUser = async (
  seller: string,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(ORDERS_USER_SUPPLY),
    variables: {
      seller,
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

const ORDERS_ALL_SUPPLY = `
query($first: Int!, $skip: Int!) {
  sellOrders(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
    seller
    amount
    pricePerUnit
    orderId
    isActive
    isClosed
    blockNumber
    blockTimestamp
    transactionHash
    protocolFee
    lpFee
    future {
      tokenId
      supplier
      totalAmount
      soldAmount
      pricePerUnit
      settlementRewardBPS
      deadline
      isSettled
      isActive
      isClosed
      child {
        uri
        childId
        childContract
        metadata {
          title
          image
        }
      }
    }
    fillers {
      amount
      totalCost
      buyer
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
}
`;

export const getOrdersSupplyAll = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(ORDERS_ALL_SUPPLY),
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

const PURCHASE_RECORDS = `
query($first: Int!, $skip: Int!, $buyer: String!) {
  purchaseRecords(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip, where: {buyer: $buyer}) {
      amount
      totalCost
      buyer
      blockNumber
      blockTimestamp
      transactionHash
      order {
      seller
    amount
    pricePerUnit
    orderId
    isActive
    isClosed
    blockNumber
    blockTimestamp
    transactionHash
    protocolFee
    lpFee
      }
future {
      tokenId
      supplier
      totalAmount
      soldAmount
      pricePerUnit
      settlementRewardBPS
      deadline
      isSettled
      isActive
      isClosed
      child {
        uri
        childId
        childContract
        metadata {
          title
          image
        }
      }
    }
  }
}
`;

export const getUserPurchaseRecords = async (
  buyer: string,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(PURCHASE_RECORDS),
    variables: {
      buyer,
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



const PURCHASE_RECORDS_ALL = `
query($first: Int!, $skip: Int!) {
  purchaseRecords(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip, where: {future_: {totalAmount_gt: 0}}) {
      amount
      totalCost
      buyer
      blockNumber
      blockTimestamp
      transactionHash
      order {
      seller
    amount
    pricePerUnit
    orderId
    isActive
    isClosed
    blockNumber
    blockTimestamp
    transactionHash
    protocolFee
    lpFee
      }
future {
      tokenId
      supplier
      totalAmount
      soldAmount
      pricePerUnit
      settlementRewardBPS
      deadline
      isSettled
      isActive
      isClosed
      child {
        uri
        childId
        childContract
        metadata {
          title
          image
        }
      }
    }
  }
}
`;

export const getPurchaseRecords = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(PURCHASE_RECORDS_ALL),
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

