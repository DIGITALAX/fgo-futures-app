import { useContext, useEffect, useState } from "react";
import { FutureContract } from "../types/layout.types";
import { useAccount } from "wagmi";
import {
  getFutureContractsAll,
  getFutureContractsBuyer,
} from "@/app/lib/subgraph/queries/getCreatedContracts";
import { AppContext } from "@/app/lib/providers/Providers";

const useFutures = () => {
  const { address } = useAccount();
  const context = useContext(AppContext);
  const [futures, setFutures] = useState<FutureContract[]>([]);
  const [userFutures, setUserFutures] = useState<FutureContract[]>([]);
  const [futuresLoading, setFuturesLoading] = useState<boolean>(false);
  const [userFuturesLoading, setUserFuturesLoading] = useState<boolean>(false);
  
  const [futuresSkip, setFuturesSkip] = useState<number>(0);
  const [userFuturesSkip, setUserFuturesSkip] = useState<number>(0);
  const [hasMoreFutures, setHasMoreFutures] = useState<boolean>(true);
  const [hasMoreUserFutures, setHasMoreUserFutures] = useState<boolean>(true);

  const getFutures = async (reset: boolean = false) => {
    setFuturesLoading(true);
    try {
      const skipValue = reset ? 0 : futuresSkip;
      const data = await getFutureContractsAll(20, skipValue);
      
      let allFutures = data?.data?.futuresContracts;
      
      if (!allFutures || allFutures.length < 20) {
        setHasMoreFutures(false);
      }
      
      if (reset) {
        setFutures(allFutures || []);
        setFuturesSkip(20);
      } else {
        setFutures(prev => [
          ...prev,
          ...(allFutures || [])
        ]);
        setFuturesSkip(prev => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFuturesLoading(false);
  };

  const getUserFutures = async (reset: boolean = false) => {
    if (!address) return;
    setUserFuturesLoading(true);
    try {
      const skipValue = reset ? 0 : userFuturesSkip;
      const data = await getFutureContractsBuyer(address, 20, skipValue);
      
      let allUserFutures = data?.data?.futuresContracts;
      
      if (!allUserFutures || allUserFutures.length < 20) {
        setHasMoreUserFutures(false);
      }
      
      if (reset) {
        setUserFutures(allUserFutures || []);
        setUserFuturesSkip(20);
      } else {
        setUserFutures(prev => [
          ...prev,
          ...(allUserFutures || [])
        ]);
        setUserFuturesSkip(prev => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setUserFuturesLoading(false);
  };

  useEffect(() => {
    if (futures.length < 1) {
      getFutures(true);
    }
  }, [context?.hideSuccess]);

  useEffect(() => {
    if (userFutures.length < 1 && address) {
      getUserFutures(true);
    }
  }, [address, context?.hideSuccess]);

  const loadMoreFutures = () => {
    if (!futuresLoading && hasMoreFutures) {
      getFutures(false);
    }
  };

  const loadMoreUserFutures = () => {
    if (!userFuturesLoading && hasMoreUserFutures) {
      getUserFutures(false);
    }
  };

  return {
    futures,
    futuresLoading,
    userFutures,
    userFuturesLoading,
    hasMoreFutures,
    hasMoreUserFutures,
    loadMoreFutures,
    loadMoreUserFutures,
  };
};

export default useFutures;
