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
  const [activeTransferKey, setActiveTransferKey] = useState<string | null>(
    null
  );

  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleTransferRights = async ({
    childId,
    orderId,
    amount,
    childContract,
    marketContract,
    key,
  }: {
    childId: number;
    orderId: number;
    amount: number;
    childContract: string;
    marketContract: string;
    key: string;
  }) => {
    if (!walletClient || !publicClient || !address) return;

    setActiveTransferKey(key);

    try {
      const hash = await walletClient.writeContract({
        address: childContract as `0x${string}`,
        abi: ABIS.FGOChild,
        functionName: "transferPhysicalRights",
        args: [childId, orderId, amount, contracts.escrow, marketContract],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Physical Rights Transferred!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setActiveTransferKey((currentKey) =>
      currentKey === key ? null : currentKey
    );
  };

  return {
    transferLoading: !!activeTransferKey,
    transferLoadingKey: activeTransferKey,
    handleTransferRights,
  };
};

export default useTransfer;
