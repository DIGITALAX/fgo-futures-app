import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { AppContext } from "@/app/lib/providers/Providers";
import { useContext, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { OpenContractForm } from "../types/layout.types";

const useTrade = () => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [sellOrderLoading, setSellOrderLoading] = useState<boolean>(false);
  const [orderFillLoading, setOrderFillLoading] = useState<boolean>(false);
  const [orderCancelLoading, setOrderCancelLoading] = useState<boolean>(false);
  const [futureCancelLoading, setFutureCancelLoading] =
    useState<boolean>(false);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleSellOrder = async (orderId: number, quantity: number) => {
    if (!walletClient || !publicClient || !address) return;
    setSellOrderLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.trading,
        abi: ABIS.FGOFuturesTrading,
        functionName: "createSellOrder",
        args: [orderId, quantity],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Order Filled!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setSellOrderLoading(false);
  };

  const handleFillOrder = async (orderId: number, quantity: number) => {
    if (!walletClient || !publicClient || !address) return;
    setOrderFillLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.trading,
        abi: ABIS.FGOFuturesTrading,
        functionName: "buyFromOrder",
        args: [orderId, quantity],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Order Filled!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setOrderFillLoading(false);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!walletClient || !publicClient || !address) return;
    setOrderCancelLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.trading,
        abi: ABIS.FGOFuturesTrading,
        functionName: "cancelOrder",
        args: [orderId],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Order Cancelled!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err?.message);
    }
    setOrderCancelLoading(false);
  };

  const handleCancelFuture = async (contractId: number) => {
    if (!walletClient || !publicClient || !address) return;
    setFutureCancelLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.futures,
        abi: ABIS.FGOFuturesContract,
        functionName: "cancelFuturesContract",
        args: [contractId],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Future Contract Cancelled!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setFutureCancelLoading(false);
  };

  return {
    orderCancelLoading,
    orderFillLoading,
    sellOrderLoading,
    handleSellOrder,
    handleFillOrder,
    handleCancelOrder,
    handleCancelFuture,
    futureCancelLoading,
  };
};

export default useTrade;
