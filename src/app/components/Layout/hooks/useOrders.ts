import { useContext, useEffect, useState } from "react";
import { Order } from "../types/layout.types";
import {
  getOrdersAll,
  getOrdersUser,
} from "@/app/lib/subgraph/queries/getOrders";
import { useAccount } from "wagmi";
import { AppContext } from "@/app/lib/providers/Providers";

const useOrders = () => {
  const { address } = useAccount();
  const context = useContext(AppContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [userOrdersLoading, setUserOrdersLoading] = useState<boolean>(false);

  const getOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await getOrdersAll();
      setOrders(data?.data?.orders);
    } catch (err: any) {
      console.error(err.message);
    }
    setOrdersLoading(false);
  };

  const getUserOrders = async () => {
    if (!address) return;
    setUserOrdersLoading(true);
    try {
      const data = await getOrdersUser(address);
      setUserOrders(data?.data?.orders);
    } catch (err: any) {
      console.error(err.message);
    }
    setUserOrdersLoading(false);
  };

  useEffect(() => {
    if (orders.length < 1) {
      getOrders();
    }
  }, [, context?.hideSuccess]);

  useEffect(() => {
    if (userOrders.length < 1 && address) {
      getUserOrders();
    }
  }, [address, context?.hideSuccess]);

  return {
    orders,
    ordersLoading,
    userOrders,
    userOrdersLoading,
  };
};

export default useOrders;
