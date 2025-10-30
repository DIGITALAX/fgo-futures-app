import { gql } from "@apollo/client";
import { graphFGOClient } from "../clients/graphql";

const ALL_CHILDREN = `
query {
  childs(first: 200, orderBy: blockTimestamp, orderDirection: desc) {
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
