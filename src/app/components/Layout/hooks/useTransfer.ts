import { useState, useContext } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { AppContext } from "@/app/lib/providers/Providers";
import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";

const useTransfer = () => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [transferLoading, setTransferLoading] = useState<boolean>(false);

  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleTransferRights = async (
    childId: number,
    orderId: number,
    amount: number,
    marketContract: string
  ) => {
    if (!walletClient || !publicClient || !address) return;
    setTransferLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.child,
        abi: ABIS.FGOChild,
        functionName: "transferPhysicalRights",
        args: [childId, orderId, amount, contracts.escrow, marketContract],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Physical Rights Withdrawn!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setTransferLoading(false);
  };

  return {
    transferLoading,
    handleTransferRights,
  };
};

export default useTransfer;
