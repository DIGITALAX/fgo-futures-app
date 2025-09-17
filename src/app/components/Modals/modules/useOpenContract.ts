import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { AppContext } from "@/app/lib/providers/Providers";
import { useContext, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { OpenContractForm } from "../../Layout/types/layout.types";

const useOpenContract = () => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [openContractLoading, setOpenContractLoading] =
    useState<boolean>(false);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);
  const [openContractForm, setOpenContractForm] = useState<OpenContractForm>({
    childId: context?.openContract?.childId || 0,
    orderId: context?.openContract?.orderId || 0,
    amount: 0,
    pricePerUnit: 0,
    settlementRewardBPS: 0,
    childContract: context?.openContract?.childContract || "",
    originalMarket: context?.openContract?.originalMarket || "",
    trustedSettlementBots: [],
    image: "",
    title: "",
  });

  const handleOpenContract = async () => {
    if (!walletClient || !publicClient || !address) return;
    setOpenContractLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", openContractForm.image);

      const responseImage = await fetch("/api/ipfs", {
        method: "POST",
        body: formData,
      });

      const resImage = await responseImage.json();
      const response = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: openContractForm.title,
          image: "ipfs://" + resImage.hash,
        }),
      });

      const result = await response.json();

      const hash = await walletClient.writeContract({
        address: contracts.escrow,
        abi: ABIS.FGOFuturesContract,
        functionName: "openFuturesContract",
        args: [...Object.values(openContractForm), "ipfs://" + result.hash],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Futures Contract Opened!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setOpenContractLoading(false);
  };

  return {
    handleOpenContract,
    openContractLoading,
    openContractForm,
    setOpenContractForm,
  };
};

export default useOpenContract;
