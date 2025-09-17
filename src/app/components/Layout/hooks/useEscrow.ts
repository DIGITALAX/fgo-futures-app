import { useState, useEffect, useContext } from "react";
import {
  getEscrowedRightsAll,
  getEscrowedRightsBuyer,
} from "@/app/lib/subgraph/queries/getEscrowedRights";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { EscrowedRight } from "../types/layout.types";
import { AppContext } from "@/app/lib/providers/Providers";
import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";

const useSettled = () => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [escrowedRights, setEscrowedRights] = useState<EscrowedRight[]>([]);
  const [escrowLoading, setEscrowLoading] = useState<boolean>(false);
  const [escrowedRightsUser, setEscrowedRightsUser] = useState<EscrowedRight[]>(
    []
  );
  const [escrowUserLoading, setEscrowUserLoading] = useState<boolean>(false);
  const [depositLoading, setDepositLoading] = useState<boolean>(false);
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);

  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleDepositPhysicalRights = async (chosenRights: {
    childId: number;
    orderId: number;
    amount: number;
    originalMarket: string;
    childContract: string;
  }) => {
    if (!walletClient || !publicClient || !address || !chosenRights) return;
    setDepositLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.escrow,
        abi: ABIS.FGOFuturesEscrow,
        functionName: "depositPhysicalRights",
        args: [...Object.values(chosenRights)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Physical Rights Deposited!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setDepositLoading(false);
  };

  const handleWithdrawPhysicalRights = async (chosenRights: {
    childId: number;
    orderId: number;
    amount: number;
    originalMarket: string;
    childContract: string;
  }) => {
    if (!walletClient || !publicClient || !address || !chosenRights) return;
    setWithdrawLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.escrow,
        abi: ABIS.FGOFuturesEscrow,
        functionName: "withdrawPhysicalRights",
        args: [...Object.values(chosenRights)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Physical Rights Withdrawn!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setWithdrawLoading(false);
  };

  const getEscrowAll = async () => {
    setEscrowLoading(true);
    try {
      const res = await getEscrowedRightsAll();
      setEscrowedRights(res?.data?.escrowedRights);
    } catch (err: any) {
      console.error(err.message);
    }
    setEscrowLoading(false);
  };

  const getEscrowUser = async () => {
    if (!address) return;
    setEscrowUserLoading(true);
    try {
      const res = await getEscrowedRightsBuyer(address);
      setEscrowedRightsUser(res?.data?.escrowedRights);
    } catch (err: any) {
      console.error(err.message);
    }
    setEscrowUserLoading(false);
  };

  useEffect(() => {
    if (escrowedRights?.length < 1) {
      getEscrowAll();
    }
  }, [context?.hideSuccess]);

  useEffect(() => {
    if (address && escrowedRightsUser.length < 1) {
      getEscrowUser();
    }
  }, [address, context?.hideSuccess]);

  return {
    escrowLoading,
    escrowUserLoading,
    escrowedRights,
    escrowedRightsUser,
    handleDepositPhysicalRights,
    handleWithdrawPhysicalRights,
    depositLoading,
    withdrawLoading,
  };
};

export default useSettled;
