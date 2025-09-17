import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { AppContext } from "@/app/lib/providers/Providers";
import { useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { SettlementBot } from "../types/layout.types";
import {
  getSettlementBotsAll,
  getSettlementBotsUser,
} from "@/app/lib/subgraph/queries/getSettlement";

const useRegisterBot = () => {
  const context = useContext(AppContext);
  const [registerSettlementLoading, setRegisterSettlementLoading] =
    useState<boolean>(false);
  const [stakeLoading, setStakeLoading] = useState<boolean>(false);
  const [settlementBot, setSettlementBot] = useState<
    SettlementBot | undefined
  >();
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [settlementBots, setSettlementBots] = useState<SettlementBot[]>([]);
  const [settlementBotsLoading, setSettlementBotsLoading] = useState<boolean>(false);
  const [settlementBotsSkip, setSettlementBotsSkip] = useState<number>(0);
  const [hasMoreSettlementBots, setHasMoreSettlementBots] = useState<boolean>(true);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const getUserSettlementBot = async () => {
    if (!address) return;
    try {
      const data = await getSettlementBotsUser(address);
      setSettlementBot(data?.data?.settlementBots?.[0]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getAllSettlementBots = async (reset: boolean = false) => {
    setSettlementBotsLoading(true);
    try {
      const skipValue = reset ? 0 : settlementBotsSkip;
      const data = await getSettlementBotsAll(20, skipValue);
      
      let allBots = data?.data?.settlementBots;
      
      if (!allBots || allBots.length < 20) {
        setHasMoreSettlementBots(false);
      }
      
      if (reset) {
        setSettlementBots(allBots || []);
        setSettlementBotsSkip(20);
        context?.setSettlementBots(allBots || []);
      } else {
        const newBots = [...settlementBots, ...(allBots || [])];
        setSettlementBots(newBots);
        setSettlementBotsSkip(prev => prev + 20);
        context?.setSettlementBots(newBots);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSettlementBotsLoading(false);
  };

  const handleRegisterSettlement = async () => {
    if (!walletClient || !publicClient || !address) return;
    setRegisterSettlementLoading(true);
    try {
      const valid = Number(context?.stats?.mona) >= stakeAmount;
      if (!valid) {
        setRegisterSettlementLoading(false);
        context?.showError("Invalid Stake Amount.");
        return;
      }
      const hash = await walletClient.writeContract({
        address: contracts.settlement,
        abi: ABIS.FGOFuturesSettlement,
        functionName: "registerSettlementBot",
        args: [stakeAmount],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Settlement Bot Registered!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setRegisterSettlementLoading(false);
  };

  const handleIncreaseStake = async () => {
    if (!walletClient || !publicClient || !address || !settlementBot) return;
    setStakeLoading(true);
    try {
      const valid = Number(context?.stats?.mona) >= stakeAmount;
      if (!valid) {
        setRegisterSettlementLoading(false);
        context?.showError("Invalid Stake Amount.");
        return;
      }
      const hash = await walletClient.writeContract({
        address: contracts.settlement,
        abi: ABIS.FGOFuturesSettlement,
        functionName: "increaseStake",
        args: [stakeAmount],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Settlement Bot Stake Increased!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setStakeLoading(false);
  };

  const handleWithdrawStake = async () => {
    if (!walletClient || !publicClient || !address || !settlementBot) return;
    setStakeLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.settlement,
        abi: ABIS.FGOFuturesSettlement,
        functionName: "withdrawStake",
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Settlement Bot Stake Decreased!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setStakeLoading(false);
  };


  const handleClaimChildSettled = async (contractId: number) => {
    if (!walletClient || !publicClient || !address) return;
    setClaimLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.escrow,
        abi: ABIS.FGOFuturesEscrow,
        functionName: "claimChildAfterSettlement",
        args: [contractId],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Child Rights Claimed!", hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
    }
    setClaimLoading(false);
  };

  useEffect(() => {
    if (address && !settlementBot) {
      getUserSettlementBot();
    }
  }, [address]);

  useEffect(() => {
    if (settlementBots?.length < 1) {
      getAllSettlementBots(true);
    }
  }, [context?.hideSuccess]);

  const loadMoreSettlementBots = () => {
    if (!settlementBotsLoading && hasMoreSettlementBots) {
      getAllSettlementBots(false);
    }
  };

  return {
    registerSettlementLoading,
    handleRegisterSettlement,
    stakeAmount,
    setStakeAmount,
    handleIncreaseStake,
    handleWithdrawStake,
    stakeLoading,
    settlementBot,
    handleClaimChildSettled,
    claimLoading,
    settlementBots,
    settlementBotsLoading,
    hasMoreSettlementBots,
    loadMoreSettlementBots,
  };
};

export default useRegisterBot;
