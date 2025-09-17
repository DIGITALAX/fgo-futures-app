import { useEffect, useState } from "react";
import { Fulfiller } from "../types/layout.types";
import { getFulfillers } from "@/app/lib/subgraph/queries/getFulfillers";
import { dummyFulfillers } from "@/app/lib/dummy/testData";

const useFulfillers = () => {
  const [fulfillersLoading, setFulfillersLoading] = useState<boolean>(false);
  const [fulfillers, setFulfillers] = useState<Fulfiller[]>([]);
  const [fulfillersSkip, setFulfillersSkip] = useState<number>(0);
  const [hasMoreFulfillers, setHasMoreFulfillers] = useState<boolean>(true);

  const getAllFulfillers = async (reset: boolean = false) => {
    setFulfillersLoading(true);
    try {
      const skipValue = reset ? 0 : fulfillersSkip;
      const data = await getFulfillers(20, skipValue);
      
      let allFulfillers = data?.data?.fulfillers;
      
      if (!allFulfillers || allFulfillers.length < 20) {
        setHasMoreFulfillers(false);
      }
      
      if (reset) {
        setFulfillers(allFulfillers?.length < 1 ? dummyFulfillers : allFulfillers);
        setFulfillersSkip(20);
      } else {
        setFulfillers(prev => [
          ...prev,
          ...(allFulfillers?.length < 1 ? [] : allFulfillers)
        ]);
        setFulfillersSkip(prev => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFulfillersLoading(false);
  };

  useEffect(() => {
    if (fulfillers.length < 1) {
      getAllFulfillers(true);
    }
  }, []);

  const loadMoreFulfillers = () => {
    if (!fulfillersLoading && hasMoreFulfillers) {
      getAllFulfillers(false);
    }
  };

  return {
    fulfillersLoading,
    fulfillers,
    hasMoreFulfillers,
    loadMoreFulfillers,
  };
};

export default useFulfillers;
