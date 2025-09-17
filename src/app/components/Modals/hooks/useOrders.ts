import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { AppContext } from "@/app/lib/providers/Providers";
import { useContext, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

const useOrders = () => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [sellOrderLoading, setSellOrderLoading] = useState<boolean>(false);
  const [orderFillLoading, setOrderFillLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleSellOrder = async (
    orderId: number,
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
        args: [orderId, quantity, pricePerUnit],
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

  return {
    orderFillLoading,
    sellOrderLoading,
    handleSellOrder,
    handleFillOrder,
    pricePerUnit,
    setPricePerUnit,
    quantity,
    setQuantity,
  };
};

export default useOrders;
