import { gql } from "@apollo/client";
import { graphFGOFuturesClient } from "../clients/graphql";
import { getCoreContractAddresses, getCurrentNetwork } from "../../constants";

const PHYSICAL_RIGHTS_BUYER = `
query($originalBuyer: String!, $first: Int!, $skip: Int!) {
  physicalRights_collection(where: { and: [{holder: $originalBuyer},{originalBuyer: $originalBuyer}] }, first: $first, skip: $skip) {
    childId
    orderId
    buyer
    originalBuyer
    holder
    child {
      uri
      childContract
      physicalPrice
      metadata {
        image
        title
      }
    }
    guaranteedAmount
    purchaseMarket
  }
}
`;

export const getPhysicalRightsBuyer = async (
  originalBuyer: string,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
    query: gql(PHYSICAL_RIGHTS_BUYER),
    variables: {
      originalBuyer,
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

const PHYSICAL_RIGHTS_ALL = `
query($holderEscrow: String!, $first: Int!, $skip: Int!) {
  physicalRights_collection(where: {holder_not: $holderEscrow}, first: $first, skip: $skip) {
    childId
    orderId
    buyer
    holder
    originalBuyer
    child {
      uri
      childContract
      physicalPrice
      metadata {
        image
        title
      }
    }
    guaranteedAmount
    purchaseMarket
  }
}
`;

export const getPhysicalRightsAll = async (
  first: number,
  skip: number
): Promise<any> => {
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const queryPromise = graphFGOFuturesClient.query({
    query: gql(PHYSICAL_RIGHTS_ALL),
    variables: {
      holderEscrow: contracts.escrow,
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

const PHYSICAL_RIGHTS_ALL_ESCROW = `
query($holderEscrow: String!, $first: Int!, $skip: Int!) {
  physicalRights_collection(where: {holder: $holderEscrow}, first: $first, skip: $skip) {
    childId
    orderId
    buyer
    originalBuyer
    holder
    child {
      uri
      childContract
      physicalPrice
      metadata {
        image
        title
      }
    }
    guaranteedAmount
    purchaseMarket
  }
}
`;

export const getPhysicalRightsAllEscrowed = async (
  first: number,
  skip: number
): Promise<any> => {
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const queryPromise = graphFGOFuturesClient.query({
    query: gql(PHYSICAL_RIGHTS_ALL_ESCROW),
    variables: {
      holderEscrow: contracts.escrow,
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

const PHYSICAL_RIGHTS_BUYER_ESCROW = `
query($originalBuyer: String!, $holderEscrow: String!, $first: Int!, $skip: Int!) {
  physicalRights_collection(where: { and: [ {originalBuyer: $originalBuyer}, {holder: $holderEscrow}] }, first: $first, skip: $skip) {
    childId
    orderId
    buyer
    originalBuyer
    holder
    child {
      uri
      childContract
      physicalPrice
      metadata {
        image
        title
      }
    }
    guaranteedAmount
    purchaseMarket
  }
}
`;

export const getPhysicalRightsBuyerEscrowed = async (
  originalBuyer: string,
  first: number,
  skip: number
): Promise<any> => {
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const queryPromise = graphFGOFuturesClient.query({
    query: gql(PHYSICAL_RIGHTS_BUYER_ESCROW),
    variables: {
      originalBuyer,
      holderEscrow: contracts.escrow,
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
