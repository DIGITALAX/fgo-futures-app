import { gql } from "@apollo/client";
import { graphFGOClient } from "../clients/graphql";

const ALL_CHILDREN = `
query {
  childs(first: 1000, orderBy: blockTimestamp, orderDirection: desc) {
    createdAt
    uri
    status
    supplier
    scm
    futures {
      pricePerUnit
    }
    infraCurrency
    physicalPrice
    digitalPrice
    supplyCount
    availability
    childId
    childContract
    supplierProfile {
      uri 
      metadata {
        title
      }
    }
    metadata {
      title
      image
    }
  }
}
`;

export const getAllChildren = async (): Promise<any> => {
  try {
    const queryPromise = graphFGOClient.query({
      query: gql(ALL_CHILDREN),
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
    }

    if (result.errors) {
      console.error(result.errors);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const SUPPLY_FUTURES = `
query($first: Int!, $skip: Int!) {
  futurePositions(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
    supplier
    supplierProfile {
        metadata {
            title
        }
    }
    totalAmount
    soldAmount
    tokenId
    pricePerUnit
    deadline
    isSettled
    isActive
    child {
        childId
        childContract
        infraCurrency
        metadata {
            title
            image
        }
    }
    blockTimestamp
    isClosed
  }
}
`;

export const getSupplyFutures = async (
  first: number,
  skip: number
): Promise<any> => {
  try {
    const queryPromise = graphFGOClient.query({
      query: gql(SUPPLY_FUTURES),
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
    }

    if (result.errors) {
      console.error(result.errors);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const SUPPLY_FUTURES_BUYER = `
query($first: Int!, $skip: Int!, $supplier: String!) {
  futurePositions(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc, where: {supplier: $supplier}) {
    supplier
    supplierProfile {
      metadata {
        title
      }
    }
    totalAmount
    soldAmount
    tokenId
    pricePerUnit
    deadline
    isSettled
    isActive
    purchases {
      amount
      totalCost
      buyer
      blockNumber
      blockTimestamp
      transactionHash
    }
    blockNumber
    child {
      uri
      childId
      childContract
      metadata {
        image
        title
      }
    }
    blockTimestamp
    transactionHash
    settlements {
      buyer
      credits
      blockNumber
      blockTimestamp
      transactionHash
    }
    isClosed
    closedBlockNumber
    closedBlockTimestamp
    closedTransactionHash
}
}
`;

export const getSupplyFuturesBuyer = async (
  supplier: string,
  first: number,
  skip: number
): Promise<any> => {
  try {
    const queryPromise = graphFGOClient.query({
      query: gql(SUPPLY_FUTURES_BUYER),
      variables: { supplier, first, skip },
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
    }

    if (result.errors) {
      console.error(result.errors);
    }

    return result;
  } catch (error) {
    throw error;
  }
};



const SUPPLY_FUTURES_SETTLEMENT = `
query($first: Int!, $skip: Int!) {
  futurePositions(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
    supplier
    supplierProfile {
        metadata {
            title
        }
    }
    totalAmount
    soldAmount
    pricePerUnit
    deadline
    isSettled
    isActive
    child {
        childId
        childContract
        infraCurrency
        metadata {
            title
            image
        }
    }
    tokenId
    blockTimestamp
    isClosed
    settler
    settlementRewardBPS
    settlementReward
    settlementBlockNumber
    settlementBlockTimestamp
    settlementTransactionHash
  }
}
`;

export const getSupplyFuturesSettlement = async (
  first: number,
  skip: number
): Promise<any> => {
  try {
    const queryPromise = graphFGOClient.query({
      query: gql(SUPPLY_FUTURES_SETTLEMENT),
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
    }

    if (result.errors) {
      console.error(result.errors);
    }

    return result;
  } catch (error) {
    throw error;
  }
};





const FUTURE_CREDITS = `
query($first: Int!, $skip: Int!) {
  futureCredits(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
    tokenId
    buyer
    credits
    consumed
    position
    child {
      uri
      childContract
      childId
      metadata {
        title
        image
      }
    } 
  }
}
`;

export const getFutureCredits = async (
  first: number,
  skip: number
): Promise<any> => {
  try {
    const queryPromise = graphFGOClient.query({
      query: gql(FUTURE_CREDITS),
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
    }

    if (result.errors) {
      console.error(result.errors);
    }

    return result;
  } catch (error) {
    throw error;
  }
};