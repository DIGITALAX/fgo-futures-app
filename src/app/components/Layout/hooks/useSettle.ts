import { useState, useEffect, useContext } from "react";
import { getContractsSettled } from "@/app/lib/subgraph/queries/getSettlement";
import { ContractSettled } from "../types/layout.types";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { AppContext } from "@/app/lib/providers/Providers";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ABIS } from "@/abis";
import { dummyContractsSettled } from "@/app/lib/dummy/testData";

const useSettle = () => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);
  const [contractsSettled, setContractsSettled] = useState<ContractSettled[]>(
    []
  );
  const [contractsLoading, setContractsLoading] = useState<boolean>(false);
  const [settleLoading, setSettleLoading] = useState<boolean>(false);
  const [contractsSkip, setContractsSkip] = useState<number>(0);
  const [hasMoreContracts, setHasMoreContracts] = useState<boolean>(true);

  const getContracts = async (reset: boolean = false) => {
    setContractsLoading(true);
    try {
      const skipValue = reset ? 0 : contractsSkip;
      const res = await getContractsSettled(20, skipValue);
      
      let allContracts = res?.data?.futuresContracts;
      
      if (!allContracts || allContracts.length < 20) {
        setHasMoreContracts(false);
      }
      
      if (reset) {
        setContractsSettled(
          allContracts?.length < 1 ? dummyContractsSettled : allContracts
        );
        setContractsSkip(20);
      } else {
        setContractsSettled(prev => [
          ...prev,
          ...(allContracts?.length < 1 ? [] : allContracts)
        ]);
        setContractsSkip(prev => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setContractsLoading(false);
  };

  const handleEmergencySettle = async (contractId: number) => {
    if (!walletClient || !publicClient || !address) return;
    setSettleLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.settlement,
        abi: ABIS.FGOFuturesSettlement,
        functionName: "emergencySettleFuturesContract",
        args: [contractId],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Emergency Settlement Success!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setSettleLoading(false);
  };

  useEffect(() => {
    if (contractsSettled?.length < 1) {
      getContracts(true);
    }
  }, []);

  const loadMoreContracts = () => {
    if (!contractsLoading && hasMoreContracts) {
      getContracts(false);
    }
  };

  return {
    contractsSettled,
    contractsLoading,
    handleEmergencySettle,
    settleLoading,
    hasMoreContracts,
    loadMoreContracts,
  };
};

export default useSettle;
