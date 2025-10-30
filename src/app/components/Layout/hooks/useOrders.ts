import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { Order } from "../types/layout.types";
import {
  getOrdersAll,
  getOrdersUser,
} from "@/app/lib/subgraph/queries/getOrders";
import { useAccount, usePublicClient } from "wagmi";
import { AppContext } from "@/app/lib/providers/Providers";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";

const useOrders = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [userOrdersLoading, setUserOrdersLoading] = useState<boolean>(false);
  const [ordersSkip, setOrdersSkip] = useState<number>(0);
  const [userOrdersSkip, setUserOrdersSkip] = useState<number>(0);
  const [hasMoreOrders, setHasMoreOrders] = useState<boolean>(true);
  const [hasMoreUserOrders, setHasMoreUserOrders] = useState<boolean>(true);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const lastOrdersRequestTime = useRef<number>(0);
  const lastUserOrdersRequestTime = useRef<number>(0);
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
        const skipValue = reset ? 0 : ordersSkip;
        const cacheKey = `orders-${skipValue}`;

        if (ordersCache.current[cacheKey] && !reset) {
          const cachedData = ordersCache.current[cacheKey];
          setOrders((prev) => [
            ...prev,
            ...(cachedData?.length < 1 ? [] : cachedData),
          ]);
          setOrdersSkip((prev) => prev + 20);
          setOrdersLoading(false);
          return;
        }

        const data = await getOrdersAll(20, skipValue);

        let allOrders = data?.data?.orders;

        if (!allOrders || allOrders.length < 20) {
          setHasMoreOrders(false);
        }

        if (allOrders?.length > 0 && publicClient && address) {
          allOrders = await Promise.all(
            allOrders.map(async (order: Order) => {
              let balanceOf = 0;
              if (publicClient && address) {
                const res = await publicClient.readContract({
                  address: contracts.trading,
                  abi: [
                    {
                      type: "function",
                      name: "balanceOf",
                      inputs: [
                        {
                          name: "owner",
                          type: "address",
                          internalType: "address",
                        },
                      ],
                      outputs: [
                        { name: "", type: "uint256", internalType: "uint256" },
                      ],
                      stateMutability: "view",
                    },
                  ],
                  functionName: "balanceOf",
                  args: [address],
                });
                balanceOf = Number(res);
              }

              return {
                ...order,
                balanceOf,
              };
            })
          );
        }

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
    [ordersSkip, ordersLoading, publicClient, address, contracts.trading]
  );

  const getUserOrders = useCallback(
    async (reset: boolean = false) => {
      if (!address || !publicClient) {
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
        const skipValue = reset ? 0 : userOrdersSkip;
        const cacheKey = `user-orders-${address}-${skipValue}`;

        if (ordersCache.current[cacheKey] && !reset) {
          const cachedData = ordersCache.current[cacheKey];
          setUserOrders((prev) => [
            ...prev,
            ...(cachedData?.length < 1 ? [] : cachedData),
          ]);
          setUserOrdersSkip((prev) => prev + 20);
          setUserOrdersLoading(false);
          return;
        }

        const data = await getOrdersUser(address, 20, skipValue);

        let allOrders = data?.data?.orders;

        if (!allOrders || allOrders.length < 20) {
          setHasMoreUserOrders(false);
        }

        if (allOrders?.length > 0 && publicClient && address) {
          allOrders = await Promise.all(
            allOrders.map(async (order: Order) => {
              const res = await publicClient.readContract({
                address: contracts.trading,
                abi: [
                  {
                    type: "function",
                    name: "balanceOf",
                    inputs: [
                      {
                        name: "account",
                        type: "address",
                        internalType: "address",
                      },
                      { name: "id", type: "uint256", internalType: "uint256" },
                    ],
                    outputs: [
                      { name: "", type: "uint256", internalType: "uint256" },
                    ],
                    stateMutability: "view",
                  },
                ],
                functionName: "balanceOf",
                args: [address, BigInt(order.tokenId)],
              });
              return {
                ...order,
                balanceOf: Number(res),
              };
            })
          );
        }

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
    [
      address,
      userOrdersSkip,
      userOrdersLoading,
      publicClient,
      contracts.trading,
    ]
  );

  useEffect(() => {
    if (orders?.length < 1 && !ordersLoading) {
      getOrders(true);
    }
  }, [getOrders, orders?.length, ordersLoading]);

  useEffect(() => {
    if (
      userOrders?.length < 1 &&
      address &&
      publicClient &&
      !userOrdersLoading
    ) {
      getUserOrders(true);
    }
  }, [
    getUserOrders,
    userOrders?.length,
    address,
    publicClient,
    userOrdersLoading,
  ]);

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

  return {
    orders,
    ordersLoading,
    userOrders,
    userOrdersLoading,
    hasMoreOrders,
    hasMoreUserOrders,
    loadMoreOrders,
    loadMoreUserOrders,
  };
};

export default useOrders;
