import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { PhysicalRight } from "../types/layout.types";
import {
  getPhysicalRightsAll,
  getPhysicalRightsBuyer,
  getPhysicalRightsAllEscrowed,
  getPhysicalRightsBuyerEscrowed,
} from "@/app/lib/subgraph/queries/getPhysicalRights";
import { useAccount } from "wagmi";
import { AppContext } from "@/app/lib/providers/Providers";
import { dummyPhysicalRights } from "@/app/lib/dummy/testData";

const usePhysicalRights = () => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const [physicalRights, setPhysicalRights] = useState<PhysicalRight[]>([]);
  const [physicalRightsEscrowed, setPhysicalRightsEscrowed] = useState<
    PhysicalRight[]
  >([]);
  const [physicalRightsUserEscrowed, setPhysicalRightsUserEscrowed] = useState<
    PhysicalRight[]
  >([]);
  const [physicalRightsUser, setPhysicalRightsUser] = useState<PhysicalRight[]>(
    []
  );
  const [physicalLoading, setPhysicalLoading] = useState<boolean>(false);
  const [physicalUserLoading, setPhysicalUserLoading] =
    useState<boolean>(false);
  const [physicalEscrowedLoading, setPhysicalEscrowedLoading] =
    useState<boolean>(false);
  const [physicalUserEscrowedLoading, setPhysicalUserEscrowedLoading] =
    useState<boolean>(false);
  
  const [physicalRightsSkip, setPhysicalRightsSkip] = useState<number>(0);
  const [physicalRightsUserSkip, setPhysicalRightsUserSkip] = useState<number>(0);
  const [physicalRightsEscrowedSkip, setPhysicalRightsEscrowedSkip] = useState<number>(0);
  const [physicalRightsUserEscrowedSkip, setPhysicalRightsUserEscrowedSkip] = useState<number>(0);
    const [hasMorePhysicalRights, setHasMorePhysicalRights] = useState<boolean>(true);
  const [hasMorePhysicalRightsUser, setHasMorePhysicalRightsUser] = useState<boolean>(true);
  const [hasMorePhysicalRightsEscrowed, setHasMorePhysicalRightsEscrowed] = useState<boolean>(true);
  const [hasMorePhysicalRightsUserEscrowed, setHasMorePhysicalRightsUserEscrowed] = useState<boolean>(true);
  
  const lastRequestTimes = useRef({
    physicalRights: 0,
    physicalRightsUser: 0,
    physicalRightsEscrowed: 0,
    physicalRightsUserEscrowed: 0,
  });
  const requestCache = useRef<{ [key: string]: any }>({});

  const getPhysicalRights = useCallback(async (reset: boolean = false) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTimes.current.physicalRights;
    
    if (timeSinceLastRequest < 1000) {
      console.log("Physical rights request throttled");
      return;
    }
    
    if (physicalLoading) {
      console.log("Physical rights request skipped - already loading");
      return;
    }
    
    setPhysicalLoading(true);
    lastRequestTimes.current.physicalRights = now;
    
    try {
      const skipValue = reset ? 0 : physicalRightsSkip;
      const cacheKey = `physical-rights-${skipValue}`;
      
      if (requestCache.current[cacheKey] && !reset) {
        console.log("Using cached physical rights data");
        const cachedData = requestCache.current[cacheKey];
        setPhysicalRights(prev => [...prev, ...(cachedData?.length < 1 ? [] : cachedData)]);
        setPhysicalRightsSkip(prev => prev + 20);
        setPhysicalLoading(false);
        return;
      }
      
      const data = await getPhysicalRightsAll(20, skipValue);
      
      let allRights = data?.data?.physicalRights_collection;
      
      if (!allRights || allRights.length < 20) {
        setHasMorePhysicalRights(false);
      }
      
      requestCache.current[cacheKey] = allRights;
      
      if (reset) {
        setPhysicalRights(allRights?.length < 1 ? dummyPhysicalRights : allRights);
        setPhysicalRightsSkip(20);
      } else {
        setPhysicalRights(prev => [
          ...prev,
          ...(allRights?.length < 1 ? [] : allRights)
        ]);
        setPhysicalRightsSkip(prev => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPhysicalLoading(false);
  }, [physicalRightsSkip, physicalLoading]);

  const getPhysicalRightsEscrowed = async (reset: boolean = false) => {
    setPhysicalEscrowedLoading(true);
    try {
      const skipValue = reset ? 0 : physicalRightsEscrowedSkip;
      const data = await getPhysicalRightsAllEscrowed(20, skipValue);
      
      let allRights = data?.data?.physicalRights_collection;
      
      if (!allRights || allRights.length < 20) {
        setHasMorePhysicalRightsEscrowed(false);
      }
      
      if (reset) {
        setPhysicalRightsEscrowed(allRights?.length < 1 ? dummyPhysicalRights : allRights);
        setPhysicalRightsEscrowedSkip(20);
      } else {
        setPhysicalRightsEscrowed(prev => [
          ...prev,
          ...(allRights?.length < 1 ? [] : allRights)
        ]);
        setPhysicalRightsEscrowedSkip(prev => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPhysicalEscrowedLoading(false);
  };

  const getPhysicalRightsUser = async (reset: boolean = false) => {
    if (!address) {
      return;
    }
    setPhysicalUserLoading(true);
    try {
      const skipValue = reset ? 0 : physicalRightsUserSkip;
      const data = await getPhysicalRightsBuyer(address, 20, skipValue);
      
      let allRights = data?.data?.physicalRights_collection;
      
      if (!allRights || allRights.length < 20) {
        setHasMorePhysicalRightsUser(false);
      }
      
      if (reset) {
        setPhysicalRightsUser(
          allRights?.length < 1
            ? dummyPhysicalRights.slice(0, 1)
            : allRights
        );
        setPhysicalRightsUserSkip(20);
      } else {
        setPhysicalRightsUser(prev => [
          ...prev,
          ...(allRights?.length < 1 ? [] : allRights)
        ]);
        setPhysicalRightsUserSkip(prev => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPhysicalUserLoading(false);
  };

  const getPhysicalRightsUserEscrowed = async (reset: boolean = false) => {
    if (!address) {
      return;
    }
    setPhysicalUserEscrowedLoading(true);
    try {
      const skipValue = reset ? 0 : physicalRightsUserEscrowedSkip;
      const data = await getPhysicalRightsBuyerEscrowed(address, 20, skipValue);
      
      let allRights = data?.data?.physicalRights_collection;
      
      if (!allRights || allRights.length < 20) {
        setHasMorePhysicalRightsUserEscrowed(false);
      }
      
      if (reset) {
        setPhysicalRightsUserEscrowed(
          allRights?.length < 1
            ? dummyPhysicalRights.slice(0, 1)
            : allRights
        );
        setPhysicalRightsUserEscrowedSkip(20);
      } else {
        setPhysicalRightsUserEscrowed(prev => [
          ...prev,
          ...(allRights?.length < 1 ? [] : allRights)
        ]);
        setPhysicalRightsUserEscrowedSkip(prev => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPhysicalUserEscrowedLoading(false);
  };

  useEffect(() => {
    if (physicalRights?.length < 1) {
      getPhysicalRights(true);
    }

    if (physicalRightsEscrowed?.length < 1) {
      getPhysicalRightsEscrowed(true);
    }
  }, [context?.hideSuccess]);

  useEffect(() => {
    if (address) {
      if (physicalRightsUser?.length < 1) {
        getPhysicalRightsUser(true);
      }
      if (physicalRightsUserEscrowed?.length < 1) {
        getPhysicalRightsUserEscrowed(true);
      }
    }
  }, [address, context?.hideSuccess]);

  const loadMorePhysicalRights = useCallback(() => {
    if (!physicalLoading && hasMorePhysicalRights) {
      getPhysicalRights(false);
    }
  }, [getPhysicalRights, physicalLoading, hasMorePhysicalRights]);

  const loadMorePhysicalRightsUser = useCallback(() => {
    if (!physicalUserLoading && hasMorePhysicalRightsUser) {
      getPhysicalRightsUser(false);
    }
  }, [physicalUserLoading, hasMorePhysicalRightsUser]);

  const loadMorePhysicalRightsEscrowed = useCallback(() => {
    if (!physicalEscrowedLoading && hasMorePhysicalRightsEscrowed) {
      getPhysicalRightsEscrowed(false);
    }
  }, [physicalEscrowedLoading, hasMorePhysicalRightsEscrowed]);

  const loadMorePhysicalRightsUserEscrowed = useCallback(() => {
    if (!physicalUserEscrowedLoading && hasMorePhysicalRightsUserEscrowed) {
      getPhysicalRightsUserEscrowed(false);
    }
  }, [physicalUserEscrowedLoading, hasMorePhysicalRightsUserEscrowed]);

  return {
    physicalRights,
    physicalLoading,
    physicalUserLoading,
    physicalRightsUser,
    physicalRightsEscrowed,
    physicalEscrowedLoading,
    physicalUserEscrowedLoading,
    physicalRightsUserEscrowed,
    hasMorePhysicalRights,
    hasMorePhysicalRightsUser,
    hasMorePhysicalRightsEscrowed,
    hasMorePhysicalRightsUserEscrowed,
    loadMorePhysicalRights,
    loadMorePhysicalRightsUser,
    loadMorePhysicalRightsEscrowed,
    loadMorePhysicalRightsUserEscrowed,
  };
};

export default usePhysicalRights;
