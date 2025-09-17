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

  const getFutures = async () => {
    setFuturesLoading(true);
    try {
      const data = await getFutureContractsAll();
      setFutures(data?.data?.futureContracts);
    } catch (err: any) {
      console.error(err.message);
    }
    setFuturesLoading(false);
  };

  const getUserFutures = async () => {
    if (!address) return;
    setUserFuturesLoading(true);
    try {
      const data = await getFutureContractsBuyer(address);
      setUserFutures(data?.data?.futureContracts);
    } catch (err: any) {
      console.error(err.message);
    }
    setUserFuturesLoading(false);
  };

  useEffect(() => {
    if (futures.length < 1) {
      getFutures();
    }
  }, [context?.hideSuccess]);

  useEffect(() => {
    if (userFutures.length < 1 && address) {
      getUserFutures();
    }
  }, [address, context?.hideSuccess]);

  return {
    futures,
    futuresLoading,
    userFutures,
    userFuturesLoading,
  };
};

export default useFutures;
