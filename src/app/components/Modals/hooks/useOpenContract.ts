import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { AppContext } from "@/app/lib/providers/Providers";
import { useContext, useEffect, useRef, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { OpenContractForm } from "../../Layout/types/layout.types";

const useOpenContract = (dict: any) => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [openContractLoading, setOpenContractLoading] =
    useState<boolean>(false);
  const [selectedBots, setSelectedBots] = useState<string[]>([]);
  const [botSearch, setBotSearch] = useState<string>("");
  const [customBot, setCustomBot] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);
  const [openContractForm, setOpenContractForm] = useState<OpenContractForm>(
    () => ({
      childId: context?.openContract?.childId || 0,
      orderId: context?.openContract?.orderId || 0,
      amount: 0,
      pricePerUnit: 0,
      settlementRewardBPS: Number(context?.minValues?.bpsMin ?? 0),
      childContract: context?.openContract?.childContract || "",
      originalMarket: context?.openContract?.originalMarket || "",
      trustedSettlementBots: [],
      title: "",
    })
  );

  useEffect(() => {
    if (!context?.openContract) {
      return;
    }
    const existingContract = context?.openContract?.allContracts?.find(
      (cont) =>
        Number(cont?.pricePerUnit) / 10 ** 18 ==
        Number(openContractForm?.pricePerUnit)
    );

    if (existingContract) {
      setSelectedBots(
        existingContract?.trustedSettlementBots?.map((bot) => bot?.bot) || []
      );
      setOpenContractForm((prev) => ({
        ...prev,
        settlementRewardBPS: Number(context?.minValues?.bpsMin ?? 0),
        childId: context?.openContract?.childId || 0,
        orderId: context?.openContract?.orderId || 0,
        pricePerUnit: Number(openContractForm?.pricePerUnit),
        childContract: context?.openContract?.childContract || "",
        originalMarket: context?.openContract?.originalMarket || "",
        trustedSettlementBots:
          existingContract?.trustedSettlementBots?.map((bot) => bot?.bot) || [],
        title: existingContract?.metadata?.title,
      }));
    }
  }, [openContractForm.pricePerUnit, context?.openContract]);

  const handleOpenContract = async () => {
    if (!walletClient || !publicClient || !address) return;

    const existingContract = context?.openContract?.allContracts?.find(
      (cont) =>
        Number(cont?.pricePerUnit) / 10 ** 18 ==
        Number(openContractForm?.pricePerUnit)
    );

    
    if (openContractForm.trustedSettlementBots.length < 3) {
      context?.showError(dict?.openContractBotsError);
      return;
    }

    if (!existingContract && !openContractForm.image) {
      context?.showError(dict?.openContractImageError);
      return;
    }

    const estimatedDeliveryDuration =
      context?.openContract?.estimatedDeliveryDuration || 0;
    const currentTime = Math.floor(Date.now() / 1000);

    const estimatedDeliveryTime =
      estimatedDeliveryDuration > currentTime
        ? estimatedDeliveryDuration
        : currentTime + estimatedDeliveryDuration;

    const timeUntilDelivery = estimatedDeliveryTime - currentTime;
    const oneHour = 3600;

    if (timeUntilDelivery < oneHour) {
      context?.showError(dict?.openContractDeliveryError);
      return;
    }

    setOpenContractLoading(true);
    try {
      let metadataUri = existingContract?.uri;

      if (!existingContract) {
        const formData = new FormData();
        if (!openContractForm.image) {
          context?.showError(dict?.openContractImageError);
          setOpenContractLoading(false);
          return;
        }
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
        metadataUri = "ipfs://" + result.hash;
      }

      if (!metadataUri) {
        context?.showError(dict?.openContractMetadataError);
        setOpenContractLoading(false);
        return;
      }

     
      const hash = await walletClient.writeContract({
        address: contracts.futures,
        abi: ABIS.FGOFuturesContract,
        functionName: "openFuturesContract",
        args: [
          openContractForm.childId,
          openContractForm.orderId,
          openContractForm.amount,
          openContractForm.pricePerUnit * 10 ** 18,
          openContractForm.settlementRewardBPS,
          openContractForm.childContract,
          openContractForm.originalMarket,
          openContractForm.trustedSettlementBots,
          metadataUri,
        ],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      context?.setOpenContract(undefined);

      context?.showSuccess(
        existingContract
          ? dict?.openContractUpdateSuccess
          : dict?.openContractCreateSuccess,
        hash
      );
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setOpenContractLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      context?.openContract?.allContracts?.find(
        (cont) =>
          Number(cont?.pricePerUnit) / 10 ** 18 ==
          Number(openContractForm?.pricePerUnit)
      )
    )
      return;
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setOpenContractForm((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const addBot = (botAddress: string) => {
    if (
      context?.openContract?.allContracts?.find(
        (cont) =>
          Number(cont?.pricePerUnit) / 10 ** 18 ==
          Number(openContractForm?.pricePerUnit)
      )
    )
      return;
    if (selectedBots.length < 5 && !selectedBots.includes(botAddress)) {
      const newBots = [...selectedBots, botAddress];
      setSelectedBots(newBots);
      setOpenContractForm((prev) => ({
        ...prev,
        trustedSettlementBots: newBots,
      }));
    }
  };

  const removeBot = (botAddress: string) => {
    if (
      context?.openContract?.allContracts?.find(
        (cont) =>
          Number(cont?.pricePerUnit) / 10 ** 18 ==
          Number(openContractForm?.pricePerUnit)
      )
    )
      return;
    const newBots = selectedBots.filter((bot) => bot !== botAddress);
    setSelectedBots(newBots);
    setOpenContractForm((prev) => ({
      ...prev,
      trustedSettlementBots: newBots,
    }));
  };

  const addCustomBot = () => {
    if (
      context?.openContract?.allContracts?.find(
        (cont) =>
          Number(cont?.pricePerUnit) / 10 ** 18 ==
          Number(openContractForm?.pricePerUnit)
      )
    )
      return;
    if (
      customBot.trim() &&
      customBot.startsWith("0x") &&
      customBot.length === 42
    ) {
      addBot(customBot.trim());
      setCustomBot("");
    }
  };

  return {
    handleOpenContract,
    openContractLoading,
    openContractForm,
    setOpenContractForm,
    selectedBots,
    botSearch,
    setBotSearch,
    customBot,
    setCustomBot,
    fileInputRef,
    handleImageUpload,
    addBot,
    removeBot,
    addCustomBot,
  };
};

export default useOpenContract;
