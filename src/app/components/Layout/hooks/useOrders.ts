import { useContext, useEffect, useState } from "react";
import { Order } from "../types/layout.types";
import {
  getOrdersAll,
  getOrdersUser,
} from "@/app/lib/subgraph/queries/getOrders";
import { useAccount, usePublicClient } from "wagmi";
import { AppContext } from "@/app/lib/providers/Providers";
import { dummyOrders } from "@/app/lib/dummy/testData";
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

  const getOrders = async (reset: boolean = false) => {
    setOrdersLoading(true);
    try {
      const skipValue = reset ? 0 : ordersSkip;
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

      if (reset) {
        setOrders(allOrders?.length < 1 ? dummyOrders : allOrders);
        setOrdersSkip(20);
      } else {
        setOrders(prev => [
          ...prev,
          ...(allOrders?.length < 1 ? [] : allOrders)
        ]);
        setOrdersSkip(prev => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setOrdersLoading(false);
  };

  const getUserOrders = async (reset: boolean = false) => {
    if (!address || !publicClient) {
      return;
    }
    setUserOrdersLoading(true);
    try {
      const skipValue = reset ? 0 : userOrdersSkip;
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

      if (reset) {
        setUserOrders(allOrders?.length < 1 ? dummyOrders.slice(0, 1) : allOrders);
        setUserOrdersSkip(20);
      } else {
        setUserOrders(prev => [
          ...prev,
          ...(allOrders?.length < 1 ? [] : allOrders)
        ]);
        setUserOrdersSkip(prev => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setUserOrdersLoading(false);
  };

  useEffect(() => {
    if (orders?.length < 1) {
      getOrders(true);
    }
  }, [context?.hideSuccess, publicClient, address]);

  useEffect(() => {
    if (userOrders?.length < 1 && address && publicClient) {
      getUserOrders(true);
    }
  }, [address, context?.hideSuccess, publicClient]);

  const loadMoreOrders = () => {
    if (!ordersLoading && hasMoreOrders) {
      getOrders(false);
    }
  };

  const loadMoreUserOrders = () => {
    if (!userOrdersLoading && hasMoreUserOrders) {
      getUserOrders(false);
    }
  };

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
