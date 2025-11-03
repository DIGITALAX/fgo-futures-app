import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { AppContext } from "@/app/lib/providers/Providers";
import { useContext, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

const useTrade = (dict: any) => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [loadingKeys, setLoadingKeys] = useState<{
    [key: string]: boolean;
  }>({});
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleCancelOrder = async (orderId: number) => {
    if (!walletClient || !publicClient || !address) return;
    const key = `order-${orderId}`;
    setLoadingKeys((prev) => ({ ...prev, [key]: true }));
    try {
      const hash = await walletClient.writeContract({
        address: contracts.trading,
        abi: ABIS.FGOFuturesTrading,
        functionName: "cancelOrder",
        args: [orderId],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict?.tradeOrderCancelSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err?.message);
    }
    setLoadingKeys((prev) => ({ ...prev, [key]: false }));
  };

  const handleCancelFuture = async (contractId: number) => {
    if (!walletClient || !publicClient || !address) return;
    const key = `future-${contractId}`;
    setLoadingKeys((prev) => ({ ...prev, [key]: true }));
    try {
      const hash = await walletClient.writeContract({
        address: contracts.futures,
        abi: ABIS.FGOFuturesContract,
        functionName: "cancelFuturesContract",
        args: [contractId],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict?.tradeFutureCancelSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setLoadingKeys((prev) => ({ ...prev, [key]: false }));
  };

  return {
    loadingKeys,
    handleCancelOrder,
    handleCancelFuture,
  };
};

export default useTrade;
