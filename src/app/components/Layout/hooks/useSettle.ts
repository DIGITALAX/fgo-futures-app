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

  const getContracts = async () => {
    setContractsLoading(true);
    try {
      const res = await getContractsSettled();
      console.log({res})
      setContractsSettled(res?.data?.contractSettleds);
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
      getContracts();
    }
  }, []);

  return {
    contractsSettled,
    contractsLoading,
    handleEmergencySettle,
    settleLoading,
  };
};

export default useSettle;
