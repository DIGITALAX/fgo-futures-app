import { useEffect, useState, useCallback, useRef, useContext } from "react";
import { PurchaseRecord, SellOrder } from "../types/layout.types";
import {
  getOrdersSupplyAll,
  getOrdersSupplyUser,
  getUserPurchaseRecords,
  getPurchaseRecords,
} from "@/app/lib/subgraph/queries/getOrders";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ensureMetadata } from "@/app/lib/utils";
import { ABIS } from "@/abis";
import { AppContext } from "@/app/lib/providers/Providers";

const useSupplyOrders = (dict: any) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);
  const { data: walletClient } = useWalletClient();
  const [orders, setOrders] = useState<SellOrder[]>([]);
  const [userOrders, setUserOrders] = useState<SellOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [userOrdersLoading, setUserOrdersLoading] = useState<boolean>(false);
  const [userFilledOrders, setUserFilledOrders] = useState<PurchaseRecord[]>(
    []
  );
  const [userFilledLoading, setUserFilledLoading] = useState<boolean>(false);
  const [allFilledOrders, setAllFilledOrders] = useState<PurchaseRecord[]>([]);
  const [allFilledLoading, setAllFilledLoading] = useState<boolean>(false);
  const [ordersSkip, setOrdersSkip] = useState<number>(0);
  const [userOrdersSkip, setUserOrdersSkip] = useState<number>(0);
  const [userFilledSkip, setUserFilledSkip] = useState<number>(0);
  const [allFilledSkip, setAllFilledSkip] = useState<number>(0);
  const [hasMoreOrders, setHasMoreOrders] = useState<boolean>(true);
  const [hasMoreUserOrders, setHasMoreUserOrders] = useState<boolean>(true);
  const [hasMoreUserFilled, setHasMoreUserFilled] = useState<boolean>(true);
  const [hasMoreAllFilled, setHasMoreAllFilled] = useState<boolean>(true);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);
  const [loadingKeys, setLoadingKeys] = useState<{
    [key: string]: boolean;
  }>({});
  const lastOrdersRequestTime = useRef<number>(0);
  const lastUserOrdersRequestTime = useRef<number>(0);
  const lastUserFilledRequestTime = useRef<number>(0);
  const lastAllFilledRequestTime = useRef<number>(0);
  const ordersCache = useRef<{ [key: string]: any }>({});

  const getOrders = useCallback(
    async (reset: boolean = false) => {
      const now = Date.now();
      const timeSinceLastRequest = now - lastOrdersRequestTime.current;

      if (timeSinceLastRequest < 1000) {
        return;
      }

      if (ordersLoading) {
        return;
      }

      setOrdersLoading(true);
      lastOrdersRequestTime.current = now;

      try {
        if (reset) {
          setHasMoreOrders(true);
        }
        const skipValue = reset ? 0 : ordersSkip;
        const cacheKey = `orders-${skipValue}`;

        if (ordersCache.current[cacheKey] && !reset) {
          const cachedData = ordersCache.current[cacheKey];
          setOrders((prev) => [
            ...prev,
            ...(cachedData?.length < 1 ? [] : cachedData),
          ]);
          setOrdersSkip((prev) => prev + 20);
          if (!cachedData || cachedData.length < 20) {
            setHasMoreOrders(false);
          }
          setOrdersLoading(false);
          return;
        }

        const data = await getOrdersSupplyAll(20, skipValue);
        let allOrders = data?.data?.sellOrders;

        if (!allOrders || allOrders.length < 20) {
          setHasMoreOrders(false);
        }

        allOrders = await Promise.all(
          allOrders.map(async (item: SellOrder) => {
            return {
              ...item,
              future: {
                ...item.future,
                child: await ensureMetadata(item?.future?.child),
              },
            };
          })
        );

        ordersCache.current[cacheKey] = allOrders;

        if (reset) {
          setOrders(allOrders);
          setOrdersSkip(20);
        } else {
          setOrders((prev) => [
            ...prev,
            ...(allOrders?.length < 1 ? [] : allOrders),
          ]);
          setOrdersSkip((prev) => prev + 20);
        }
      } catch (err: any) {
        console.error(err.message);
      }
      setOrdersLoading(false);
    },
    [ordersSkip, ordersLoading, address, contracts.trading]
  );

  const getUserOrders = useCallback(
    async (reset: boolean = false) => {
      if (!address) {
        return;
      }

      const now = Date.now();
      const timeSinceLastRequest = now - lastUserOrdersRequestTime.current;

      if (timeSinceLastRequest < 1000) {
        return;
      }

      if (userOrdersLoading) {
        return;
      }

      setUserOrdersLoading(true);
      lastUserOrdersRequestTime.current = now;

      try {
        if (reset) {
          setHasMoreUserOrders(true);
        }
        const skipValue = reset ? 0 : userOrdersSkip;
        const cacheKey = `user-orders-${address}-${skipValue}`;
        if (ordersCache.current[cacheKey] && !reset) {
          const cachedData = ordersCache.current[cacheKey];
          setUserOrders((prev) => [
            ...prev,
            ...(cachedData?.length < 1 ? [] : cachedData),
          ]);
          setUserOrdersSkip((prev) => prev + 20);
          if (!cachedData || cachedData.length < 20) {
            setHasMoreUserOrders(false);
          }
          setUserOrdersLoading(false);
          return;
        }

        const data = await getOrdersSupplyUser(address, 20, skipValue);

        let allOrders = data?.data?.sellOrders;
        if (!allOrders || allOrders.length < 20) {
          setHasMoreUserOrders(false);
        }

        allOrders = await Promise.all(
          allOrders.map(async (item: SellOrder) => {
            return {
              ...item,
              future: {
                ...item.future,
                child: await ensureMetadata(item?.future?.child),
              },
            };
          })
        );

        ordersCache.current[cacheKey] = allOrders;

        if (reset) {
          setUserOrders(allOrders);
          setUserOrdersSkip(20);
        } else {
          setUserOrders((prev) => [
            ...prev,
            ...(allOrders?.length < 1 ? [] : allOrders),
          ]);
          setUserOrdersSkip((prev) => prev + 20);
        }
      } catch (err: any) {
        console.error(err.message);
      }
      setUserOrdersLoading(false);
    },
    [address, userOrdersSkip, userOrdersLoading, contracts.trading]
  );

  const getUserFilledOrders = useCallback(
    async (reset: boolean = false) => {
      if (!address) {
        return;
      }

      const now = Date.now();
      const timeSinceLastRequest = now - lastUserFilledRequestTime.current;

      if (timeSinceLastRequest < 1000) {
        return;
      }

      if (userFilledLoading) {
        return;
      }

      setUserFilledLoading(true);
      lastUserFilledRequestTime.current = now;

      try {
        if (reset) {
          setHasMoreUserFilled(true);
        }
        const skipValue = reset ? 0 : userFilledSkip;
        const cacheKey = `user-filled-${address}-${skipValue}`;

        if (ordersCache.current[cacheKey] && !reset) {
          const cachedData = ordersCache.current[cacheKey];
          setUserFilledOrders((prev) => [
            ...prev,
            ...(cachedData?.length < 1 ? [] : cachedData),
          ]);
          setUserFilledSkip((prev) => prev + 20);
          if (!cachedData || cachedData.length < 20) {
            setHasMoreUserFilled(false);
          }
          setUserFilledLoading(false);
          return;
        }

        const data = await getUserPurchaseRecords(address, 20, skipValue);
        let allFillers: PurchaseRecord[] = data?.data?.purchaseRecords || [];

        if (!allFillers || allFillers.length < 20) {
          setHasMoreUserFilled(false);
        }

        allFillers = await Promise.all(
          allFillers.map(async (item) => {
            if (!item.future) {
              return item;
            }

            return {
              ...item,
              future: {
                ...item.future,
                future: {
                  ...item.future,
                  child: await ensureMetadata(item?.future?.child),
                },
              },
            };
          })
        );

        ordersCache.current[cacheKey] = allFillers;

        if (reset) {
          setUserFilledOrders(allFillers);
          setUserFilledSkip(20);
        } else {
          setUserFilledOrders((prev) => [
            ...prev,
            ...(allFillers?.length < 1 ? [] : allFillers),
          ]);
          setUserFilledSkip((prev) => prev + 20);
        }
      } catch (err: any) {
        console.error(err.message);
      }
      setUserFilledLoading(false);
    },
    [address, userFilledSkip, userFilledLoading]
  );

  const getAllFilledOrders = useCallback(
    async (reset: boolean = false) => {
      const now = Date.now();
      const timeSinceLastRequest = now - lastAllFilledRequestTime.current;

      if (timeSinceLastRequest < 1000) {
        return;
      }

      if (allFilledLoading) {
        return;
      }

      setAllFilledLoading(true);
      lastAllFilledRequestTime.current = now;

      try {
        if (reset) {
          setHasMoreAllFilled(true);
        }
        const skipValue = reset ? 0 : allFilledSkip;
        const cacheKey = `all-filled-${skipValue}`;

        if (ordersCache.current[cacheKey] && !reset) {
          const cachedData = ordersCache.current[cacheKey];
          setAllFilledOrders((prev) => [
            ...prev,
            ...(cachedData?.length < 1 ? [] : cachedData),
          ]);
          setAllFilledSkip((prev) => prev + 20);
          if (!cachedData || cachedData.length < 20) {
            setHasMoreAllFilled(false);
          }
          setAllFilledLoading(false);
          return;
        }

        const data = await getPurchaseRecords(20, skipValue);
        let allFillers: PurchaseRecord[] = data?.data?.purchaseRecords || [];

        if (!allFillers || allFillers.length < 20) {
          setHasMoreAllFilled(false);
        }

        allFillers = await Promise.all(
          allFillers.map(async (item) => {
            if (!item.future) {
              return item;
            }

            return {
              ...item,
              future: {
                ...item.future,
                future: {
                  ...item.future,
                  child: await ensureMetadata(item?.future?.child),
                },
              },
            };
          })
        );

        ordersCache.current[cacheKey] = allFillers;

        if (reset) {
          setAllFilledOrders(allFillers);
          setAllFilledSkip(20);
        } else {
          setAllFilledOrders((prev) => [
            ...prev,
            ...(allFillers?.length < 1 ? [] : allFillers),
          ]);
          setAllFilledSkip((prev) => prev + 20);
        }
      } catch (err: any) {
        console.error(err.message);
      }
      setAllFilledLoading(false);
    },
    [allFilledSkip, allFilledLoading]
  );

  useEffect(() => {
    if (orders?.length < 1 && !ordersLoading) {
      getOrders(true);
    }
  }, [getOrders, orders?.length, ordersLoading, address]);

  useEffect(() => {
    if (userOrders?.length < 1 && address && !userOrdersLoading) {
      getUserOrders(true);
    }
  }, [getUserOrders, userOrders?.length, address, userOrdersLoading]);

  useEffect(() => {
    if (userFilledOrders?.length < 1 && address && !userFilledLoading) {
      getUserFilledOrders(true);
    }
  }, [
    getUserFilledOrders,
    userFilledOrders?.length,
    address,
    userFilledLoading,
  ]);

  useEffect(() => {
    if (allFilledOrders?.length < 1 && !allFilledLoading) {
      getAllFilledOrders(true);
    }
  }, [getAllFilledOrders, allFilledOrders?.length, allFilledLoading]);

  const handleCancelOrder = async (
    orderId: number,
    tokenId: number,
  ) => {
    const key = `order-${orderId}`;
    setLoadingKeys((prev) => ({ ...prev, [key]: true }));

    if (!walletClient || !publicClient || !address) {
      setLoadingKeys((prev) => ({ ...prev, [key]: false }));
      return;
    }

    try {
      const hash = await walletClient.writeContract({
        address: contracts.futuresCoordination,
        abi: ABIS.FGOFuturesCoordination,
        functionName: "cancelSellOrder",
        args: [BigInt(tokenId).toString(), BigInt(orderId)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict.supplyOrderCancelSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err?.message);
    }
    setLoadingKeys((prev) => ({ ...prev, [key]: false }));
  };

  const loadMoreOrders = useCallback(() => {
    if (!ordersLoading && hasMoreOrders) {
      getOrders(false);
    }
  }, [getOrders, ordersLoading, hasMoreOrders]);

  const loadMoreUserOrders = useCallback(() => {
    if (!userOrdersLoading && hasMoreUserOrders) {
      getUserOrders(false);
    }
  }, [getUserOrders, userOrdersLoading, hasMoreUserOrders]);

  const loadMoreUserFilledOrders = useCallback(() => {
    if (!userFilledLoading && hasMoreUserFilled) {
      getUserFilledOrders(false);
    }
  }, [getUserFilledOrders, userFilledLoading, hasMoreUserFilled]);

  const loadMoreAllFilledOrders = useCallback(() => {
    if (!allFilledLoading && hasMoreAllFilled) {
      getAllFilledOrders(false);
    }
  }, [getAllFilledOrders, allFilledLoading, hasMoreAllFilled]);

  return {
    orders,
    ordersLoading,
    userOrders,
    userOrdersLoading,
    userFilledOrders,
    userFilledLoading,
    allFilledOrders,
    allFilledLoading,
    hasMoreOrders,
    hasMoreUserOrders,
    hasMoreUserFilled,
    hasMoreAllFilled,
    loadMoreOrders,
    loadMoreUserOrders,
    loadMoreUserFilledOrders,
    loadMoreAllFilledOrders,
    handleCancelOrder,
    loadingKeys,
  };
};

export default useSupplyOrders;
