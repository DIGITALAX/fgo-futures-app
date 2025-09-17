import { gql } from "@apollo/client";
import { graphFGOFuturesClient } from "../clients/graphql";

const FULFILLERS = `
query($first: Int!, $skip: Int!) {
  fulfillers(first: $first, skip: $skip) {
    fulfillerId
    infraId
    fulfiller
    uri
    metadata {
        title
        image
        link
    }
    childOrders {
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
  }
}
`;

export const getFulfillers = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOFuturesClient.query({
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
