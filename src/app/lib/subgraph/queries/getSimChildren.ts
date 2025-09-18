import { gql } from "@apollo/client";
import { graphFGOClient } from "../clients/graphql";
import { getCoreContractAddresses, getCurrentNetwork } from "../../constants";

const SIM_CHILDREN = `
query($childContract: String!) {
  childs(where: {childContract: $childContract}) {
    uri
    physicalPrice
    childContract
    childId
    metadata {
        title
        image
    }
  }
}
`;

export const getSimChildren = async (): Promise<any> => {
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const queryPromise = graphFGOClient.query({
    query: gql(SIM_CHILDREN),
    variables: {
      childContract: contracts.simChild,
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
