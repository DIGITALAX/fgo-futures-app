import { gql } from "@apollo/client";
import { graphFGOFuturesClient } from "../clients/graphql";
import { getCoreContractAddresses, getCurrentNetwork } from "../../constants";

const PHYSICAL_RIGHTS_BUYER = `
query($buyer: String!, $holderEscrow: String!) {
  physicalRights_collection(orderBy: blockTimestamp, orderDirection: desc, where: { buyer: $buyer, holder_not: $holderEscrow }) {
    childId
    orderId
    buyer
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
    order {
      orderStatus
      fulfillment {
        currentStep
        createdAt
        lastUpdated
        fulfillmentOrderSteps {
          notes
          completedAt
          stepIndex
          isCompleted
        }
      }
      parent {
        designId
        parentContract
        uri
        workflow {
          physicalSteps {
            instructions
            subPerformers {
              performer
              splitBasisPoints
            }
            fulfiller {
              fulfillerId
              fulfiller
              infraId
              uri
              metadata {
                image
                title
                link
              }
            }
          }
        }
        metadata {
          title
          image
        }
      }
    }
    guaranteedAmount
    purchaseMarket
  }
}
`;

export const getPhysicalRightsBuyer = async (buyer: string): Promise<any> => {
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const queryPromise = graphFGOFuturesClient.query({
    query: gql(PHYSICAL_RIGHTS_BUYER),
    variables: {
      buyer,
      holderEscrow: contracts.escrow,
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
query($holderEscrow) {
  physicalRights_collection(orderBy: blockTimestamp, orderDirection: desc, where: {holder_not: $holderEscrow}) {
    childId
    orderId
    buyer
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
    order {
      orderStatus
      fulfillment {
        currentStep
        createdAt
        lastUpdated
        fulfillmentOrderSteps {
          notes
          completedAt
          stepIndex
          isCompleted
        }
      }
      parent {
        designId
        parentContract
        uri
        workflow {
          physicalSteps {
            instructions
            subPerformers {
              performer
              splitBasisPoints
            }
            fulfiller {
              fulfillerId
              fulfiller
              infraId
              uri
              metadata {
                image
                title
                link
              }
            }
          }
        }
        metadata {
          title
          image
        }
      }
    }
    guaranteedAmount
    purchaseMarket
  }
}
`;

export const getPhysicalRightsAll = async (): Promise<any> => {
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const queryPromise = graphFGOFuturesClient.query({
    query: gql(PHYSICAL_RIGHTS_ALL),
    variables: {
      holderEscrow: contracts.escrow,
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
query($holderEscrow) {
  physicalRights_collection(orderBy: blockTimestamp, orderDirection: desc, where: {holder: $holderEscrow}) {
    childId
    orderId
    buyer
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
    order {
      orderStatus
      fulfillment {
        currentStep
        createdAt
        lastUpdated
        fulfillmentOrderSteps {
          notes
          completedAt
          stepIndex
          isCompleted
        }
      }
      parent {
        designId
        parentContract
        uri
        workflow {
          physicalSteps {
            instructions
            subPerformers {
              performer
              splitBasisPoints
            }
            fulfiller {
              fulfillerId
              fulfiller
              infraId
              uri
              metadata {
                image
                title
                link
              }
            }
          }
        }
        metadata {
          title
          image
        }
      }
    }
    guaranteedAmount
    purchaseMarket
  }
}
`;

export const getPhysicalRightsAllEscrowed = async (): Promise<any> => {
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const queryPromise = graphFGOFuturesClient.query({
    query: gql(PHYSICAL_RIGHTS_ALL_ESCROW),
    variables: {
      holderEscrow: contracts.escrow,
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
query($buyer: String!, $holderEscrow: String!) {
  physicalRights_collection(orderBy: blockTimestamp, orderDirection: desc, where: { buyer: $buyer, holder: $holderEscrow }) {
    childId
    orderId
    buyer
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
    order {
      orderStatus
      fulfillment {
        currentStep
        createdAt
        lastUpdated
        fulfillmentOrderSteps {
          notes
          completedAt
          stepIndex
          isCompleted
        }
      }
      parent {
        designId
        parentContract
        uri
        workflow {
          physicalSteps {
            instructions
            subPerformers {
              performer
              splitBasisPoints
            }
            fulfiller {
              fulfillerId
              fulfiller
              infraId
              uri
              metadata {
                image
                title
                link
              }
            }
          }
        }
        metadata {
          title
          image
        }
      }
    }
    guaranteedAmount
    purchaseMarket
  }
}
`;

export const getPhysicalRightsBuyerEscrowed = async (
  buyer: string
): Promise<any> => {
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const queryPromise = graphFGOFuturesClient.query({
    query: gql(PHYSICAL_RIGHTS_BUYER_ESCROW),
    variables: {
      buyer,
      holderEscrow: contracts.escrow,
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
