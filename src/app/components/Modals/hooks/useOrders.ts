import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { AppContext } from "@/app/lib/providers/Providers";
import { useContext, useState, useCallback, useEffect } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

const useOrders = (dict: any) => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [approved, setApproved] = useState<boolean>(false);
  const [sellOrderLoading, setSellOrderLoading] = useState<boolean>(false);
  const [orderFillLoading, setOrderFillLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const checkAllowance = useCallback(async () => {
    if (!publicClient || !address) return false;

    try {
      const allowance = (await publicClient.readContract({
        address: contracts.mona as `0x${string}`,
        abi: [
          {
            type: "function",
            name: "allowance",
            stateMutability: "view",
            inputs: [
              { name: "owner", type: "address", internalType: "address" },
              {
                name: "spender",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
          },
        ],
        functionName: "allowance",
        args: [
          address as `0x${string}`,
          (context?.fillOrder?.supply
            ? contracts?.futuresCoordination
            : contracts.trading) as `0x${string}`,
        ],
      })) as bigint;
      if (allowance >= pricePerUnit) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    } catch (err: any) {
      console.error(err?.message || err);
      return false;
    }
  }, [publicClient, address, contracts.mona, contracts.trading]);

  const handleApprove = async (amount: bigint) => {
    if (!walletClient || !publicClient || !address) return false;
    setApproveLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.mona as `0x${string}`,
        abi: [
          {
            type: "function",
            name: "approve",
            stateMutability: "nonpayable",
            inputs: [
              { name: "spender", type: "address", internalType: "address" },
              { name: "amount", type: "uint256", internalType: "uint256" },
            ],
            outputs: [{ name: "", type: "bool", internalType: "bool" }],
          },
        ],
        functionName: "approve",
        args: [contracts.trading as `0x${string}`, amount],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      setApproveLoading(false);
      return true;
    } catch (err: any) {
      console.error(err?.message || err);
      context?.showError(err?.message);
      setApproveLoading(false);
      return false;
    }
  };

  const handleSellOrderSupply = async (
    tokenId: string,
    quantity: number,
    pricePerUnit: number
  ) => {
    if (!walletClient || !publicClient || !address) return;
    setSellOrderLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.futuresCoordination,
        abi: ABIS.FGOFuturesCoordination,
        functionName: "createSellOrder",
        args: [BigInt(tokenId).toString(), quantity, pricePerUnit],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      context?.setSellOrder(undefined);
      context?.showSuccess(dict.ordersSellSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setSellOrderLoading(false);
  };

  const handleSellOrder = async (
    tokenId: string,
    quantity: number,
    pricePerUnit: number
  ) => {
    if (!walletClient || !publicClient || !address) return;
    setSellOrderLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.trading,
        abi: ABIS.FGOFuturesTrading,
        functionName: "createSellOrder",
        args: [BigInt(tokenId).toString(), quantity, pricePerUnit],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      context?.setSellOrder(undefined);
      context?.showSuccess(dict.ordersSellSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setSellOrderLoading(false);
  };

  const handleFillOrderSupply = async (orderId: number, quantity: number) => {
    if (!walletClient || !publicClient || !address) return;
    setOrderFillLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.futuresCoordination,
        abi: ABIS.FGOFuturesCoordination,
        functionName: "buySellOrder",
        args: [BigInt(orderId), BigInt(quantity)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.setFillOrder(undefined);
      context?.showSuccess(dict.ordersFillSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setOrderFillLoading(false);
  };

  const handleFillOrder = async (orderId: number, quantity: number) => {
    if (!walletClient || !publicClient || !address) return;
    setOrderFillLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.trading,
        abi: ABIS.FGOFuturesTrading,
        functionName: "buyFromOrder",
        args: [BigInt(orderId), BigInt(quantity)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.setFillOrder(undefined);
      context?.showSuccess(dict.ordersFillSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setOrderFillLoading(false);
  };

  return {
    orderFillLoading,
    sellOrderLoading,
    approveLoading,
    handleSellOrder,
    handleFillOrder,
    handleApprove,
    checkAllowance,
    pricePerUnit,
    setPricePerUnit,
    quantity,
    setQuantity,
    handleSellOrderSupply,
    handleFillOrderSupply,
    approved,
  };
};

export default useOrders;
