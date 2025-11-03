import { gql } from "@apollo/client";
import { graphFGOClient } from "../clients/graphql";

const SUPPLIERS = `
query($first: Int!, $skip: Int!) {
  suppliers(first: $first, skip: $skip) {
    infraId
    supplier
    supplierId
    uri
    metadata {
        title
        image
        link
        description
    }
    futures {
        childId
        childContract
        uri
        transactionHash
        futures {
          totalAmount
        }
        metadata {
        title
        image
        }
    }
    blockNumber
    blockTimestamp
    transactionHash
    isActive
  }
}
`;

export const getSuppliers = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(SUPPLIERS),
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

