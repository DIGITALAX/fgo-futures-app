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

const useEscrow = () => {
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
  const [depositLoadingKey, setDepositLoadingKey] = useState<string | null>(
    null
  );
  const [withdrawLoadingKey, setWithdrawLoadingKey] = useState<string | null>(
    null
  );

  const [escrowedRightsSkip, setEscrowedRightsSkip] = useState<number>(0);
  const [escrowedRightsUserSkip, setEscrowedRightsUserSkip] =
    useState<number>(0);
  const [hasMoreEscrowedRights, setHasMoreEscrowedRights] =
    useState<boolean>(true);
  const [hasMoreEscrowedRightsUser, setHasMoreEscrowedRightsUser] =
    useState<boolean>(true);

  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  type RightsAction = {
    childId: number;
    orderId: number;
    amount: number;
    originalMarket: string;
    childContract: string;
    key: string;
  };

  const handleDepositPhysicalRights = async (chosenRights: RightsAction) => {
    if (!walletClient || !publicClient || !address || !chosenRights) return;

    const {
      childId,
      orderId,
      amount,
      originalMarket,
      childContract,
      key,
    } = chosenRights;

    setDepositLoadingKey(key);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.escrow,
        abi: ABIS.FGOFuturesEscrow,
        functionName: "depositPhysicalRights",
        args: [childId, orderId, amount, originalMarket, childContract],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Physical Rights Deposited!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setDepositLoadingKey((currentKey) =>
      currentKey === key ? null : currentKey
    );
  };

  const handleWithdrawPhysicalRights = async (chosenRights: RightsAction) => {
    if (!walletClient || !publicClient || !address || !chosenRights) return;

    const {
      childId,
      orderId,
      amount,
      originalMarket,
      childContract,
      key,
    } = chosenRights;

    setWithdrawLoadingKey(key);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.escrow,
        abi: ABIS.FGOFuturesEscrow,
        functionName: "withdrawPhysicalRights",
        args: [childId, orderId, amount, childContract, originalMarket],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Physical Rights Withdrawn!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setWithdrawLoadingKey((currentKey) =>
      currentKey === key ? null : currentKey
    );
  };

  const getEscrowAll = async (reset: boolean = false) => {
    setEscrowLoading(true);
    try {
      const skipValue = reset ? 0 : escrowedRightsSkip;
      const res = await getEscrowedRightsAll(20, skipValue);
console.log({res})
      let allRights = res?.data?.escrowedRights;

      if (!allRights || allRights.length < 20) {
        setHasMoreEscrowedRights(false);
      }

      if (reset) {
        setEscrowedRights(allRights);
        setEscrowedRightsSkip(20);
      } else {
        setEscrowedRights((prev) => [
          ...prev,
          ...(allRights?.length < 1 ? [] : allRights),
        ]);
        setEscrowedRightsSkip((prev) => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setEscrowLoading(false);
  };

  const getEscrowUser = async (reset: boolean = false) => {
    if (!address) {
      return;
    }
    setEscrowUserLoading(true);
    try {
      const skipValue = reset ? 0 : escrowedRightsUserSkip;
      const res = await getEscrowedRightsBuyer(address, 20, skipValue);

      let allRights = res?.data?.escrowedRights;

      if (!allRights || allRights.length < 20) {
        setHasMoreEscrowedRightsUser(false);
      }

      if (reset) {
        setEscrowedRightsUser(allRights);
        setEscrowedRightsUserSkip(20);
      } else {
        setEscrowedRightsUser((prev) => [
          ...prev,
          ...(allRights?.length < 1 ? [] : allRights),
        ]);
        setEscrowedRightsUserSkip((prev) => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setEscrowUserLoading(false);
  };

  useEffect(() => {
    if (escrowedRights?.length < 1) {
      getEscrowAll(true);
    }
  }, [context?.hideSuccess]);

  useEffect(() => {
    if (escrowedRightsUser?.length < 1 && address) {
      getEscrowUser(true);
    }
  }, [address, context?.hideSuccess]);

  const loadMoreEscrowedRights = () => {
    if (!escrowLoading && hasMoreEscrowedRights) {
      getEscrowAll(false);
    }
  };

  const loadMoreEscrowedRightsUser = () => {
    if (!escrowUserLoading && hasMoreEscrowedRightsUser) {
      getEscrowUser(false);
    }
  };

  return {
    escrowLoading,
    escrowUserLoading,
    escrowedRights,
    escrowedRightsUser,
    handleDepositPhysicalRights,
    handleWithdrawPhysicalRights,
    depositLoadingKey,
    withdrawLoadingKey,
    hasMoreEscrowedRights,
    hasMoreEscrowedRightsUser,
    loadMoreEscrowedRights,
    loadMoreEscrowedRightsUser,
  };
};

export default useEscrow;
