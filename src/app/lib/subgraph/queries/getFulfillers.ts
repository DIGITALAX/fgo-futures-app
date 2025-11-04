import { gql } from "@apollo/client";
import { graphFGOClient } from "../clients/graphql";

const FULFILLERS = `
query($first: Int!, $skip: Int!) {
  fulfillers(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
    fulfiller 
        uri
        infraId
        metadata {
          image
          title
          link
  }
  fulfillments {
   orderId
   contract
    order {
      fulfillmentData
      orderStatus
      transactionHash
      totalPayments
      parentAmount
    }
    parent {
      parentContract
      designId
      infraCurrency
      uri
      allNested {
        childId
        child {
          uri
        }
        childContract
      }
      metadata {
        title
        image
      }
    }
    currentStep
    createdAt
    lastUpdated
    isPhysical
    estimatedDeliveryDuration
    fulfillmentOrderSteps {
      notes
      completedAt
      isCompleted
    }
    physicalSteps {
      fulfiller {
        fulfiller 
        uri
        metadata {
          image
          title
        }
      }
      instructions
      subPerformers {
        step
        performer
        splitBasisPoints
      }
    }
  }
   
  }
}
`;

export const getFulfillers = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(FULFILLERS),
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
