import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { AppContext } from "@/app/lib/providers/Providers";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { SettlementBot } from "../types/layout.types";
import {
  getSettlementBotsAll,
  getSettlementBotsUser,
} from "@/app/lib/subgraph/queries/getSettlement";

const useRegisterBot = (dict: any) => {
  const context = useContext(AppContext);
  const [registerSettlementLoading, setRegisterSettlementLoading] =
    useState<boolean>(false);
  const [stakeLoading, setStakeLoading] = useState<boolean>(false);
  const [settlementBot, setSettlementBot] = useState<
    SettlementBot | undefined
  >();
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [stakeAmount, setStakeAmount] = useState<number>(
    context?.minValues?.stake ?? 0
  );
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [isStakeApproved, setIsStakeApproved] = useState<boolean>(false);
  const [settlementBotsLoading, setSettlementBotsLoading] =
    useState<boolean>(false);
  const [settlementBotsSkip, setSettlementBotsSkip] = useState<number>(0);
  const hasMoreSettlementBots =
    context?.hasMoreSettlementBots ?? true;
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const lastRequestTime = useRef<number>(0);
  const requestCache = useRef<{ [key: string]: any }>({});

  const checkAllowance = useCallback(async (): Promise<boolean> => {
    if (!publicClient || !address) {
      setIsStakeApproved(false);
      return false;
    }

    try {
      const allowance = (await publicClient.readContract({
        address: contracts.mona as `0x${string}`,
        abi: [
          {
            type: "function",
            name: "allowance",
            stateMutability: "view",
            inputs: [
              { name: "owner", type: "address", internalType: "address" },
              { name: "spender", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
          },
        ],
        functionName: "allowance",
        args: [address as `0x${string}`, contracts.settlement as `0x${string}`],
      })) as bigint;

      const approved = allowance >= BigInt(stakeAmount * 10 ** 18);
      setIsStakeApproved(approved);
      return approved;
    } catch (err: any) {
      console.error(err?.message || err);
      setIsStakeApproved(false);
      return false;
    }
  }, [
    publicClient,
    address,
    contracts.mona,
    contracts.settlement,
    stakeAmount,
  ]);

  const getUserSettlementBot = async () => {
    if (!address) return;
    try {
      const data = await getSettlementBotsUser(address);
      setSettlementBot(data?.data?.settlementBots?.[0]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getAllSettlementBots = useCallback(
    async (reset: boolean = false) => {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime.current;

      if (timeSinceLastRequest < 1000) {
        return;
      }

      if (settlementBotsLoading) {
        return;
      }

      setSettlementBotsLoading(true);
      lastRequestTime.current = now;

      try {
        if (reset) {
          context?.setHasMoreSettlementBots(true);
        }
        const skipValue = reset ? 0 : settlementBotsSkip;
        const cacheKey = `settlement-bots-${skipValue}`;

        if (requestCache.current[cacheKey] && !reset) {
          const cachedData = requestCache.current[cacheKey];
          const newBots = [
            ...(context?.settlementBots || []),
            ...(cachedData || []),
          ];
          setSettlementBotsSkip((prev) => prev + 20);
          context?.setSettlementBots(newBots);
          if (!cachedData || cachedData.length < 20) {
            context?.setHasMoreSettlementBots(false);
          }
          setSettlementBotsLoading(false);
          return;
        }

        const data = await getSettlementBotsAll(20, skipValue);
        let allBots = data?.data?.settlementBots;

        if (!allBots || allBots.length < 20) {
          context?.setHasMoreSettlementBots(false);
        }

        requestCache.current[cacheKey] = allBots;

        if (reset) {
          setSettlementBotsSkip(20);
          context?.setSettlementBots(allBots || []);
          context?.setHasMoreSettlementBots((allBots?.length || 0) >= 20);
        } else {
          const newBots = [
            ...(context?.settlementBots || []),
            ...(allBots || []),
          ];
          setSettlementBotsSkip((prev) => prev + 20);
          context?.setSettlementBots(newBots);
        }
      } catch (err: any) {
        console.error(err.message);
      }
      setSettlementBotsLoading(false);
    },
    [
      settlementBotsSkip,
      context?.settlementBots,
      settlementBotsLoading,
      context,
    ]
  );

  const approveStake = useCallback(async (): Promise<boolean> => {
    if (!walletClient || !publicClient || !address) return false;

    setApproveLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.mona as `0x${string}`,
        abi: [
          {
            type: "function",
            name: "approve",
            stateMutability: "nonpayable",
            inputs: [
              { name: "spender", type: "address", internalType: "address" },
              { name: "amount", type: "uint256", internalType: "uint256" },
            ],
            outputs: [{ name: "", type: "bool", internalType: "bool" }],
          },
        ],
        functionName: "approve",
        args: [
          contracts.settlement as `0x${string}`,
          BigInt(stakeAmount * 10 ** 18),
        ],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict?.registerBotApproveSuccess, hash);
      await checkAllowance();
      return true;
    } catch (err: any) {
      console.error(err.message);
      context?.showError(err.message);
      return false;
    } finally {
      setApproveLoading(false);
    }
  }, [
    walletClient,
    publicClient,
    address,
    contracts.mona,
    contracts.settlement,
    stakeAmount,
    context,
    checkAllowance,
  ]);

  const handleRegisterSettlement = async () => {
    if (!walletClient || !publicClient || !address) return;
    setRegisterSettlementLoading(true);
    try {
      const valid = Number(context?.stats?.mona) >= stakeAmount;
      if (!valid) {
        setRegisterSettlementLoading(false);
        context?.showError(dict?.insufficientMonaError);
        return;
      }

      const approved = await checkAllowance();
      if (!approved) {
        context?.showError(dict?.approveStakeFirstError);
        setRegisterSettlementLoading(false);
        return;
      }

      const hash = await walletClient.writeContract({
        address: contracts.settlement,
        abi: ABIS.FGOFuturesSettlement,
        functionName: "registerSettlementBot",
        args: [stakeAmount * 10 ** 18],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict?.registerBotSuccess, hash);
      await checkAllowance();
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
        setStakeLoading(false);
        context?.showError(dict?.insufficientMonaError);
        return;
      }

      const approved = await checkAllowance();
      if (!approved) {
        context?.showError(dict?.approveStakeFirstError);
        setStakeLoading(false);
        return;
      }

      const hash = await walletClient.writeContract({
        address: contracts.settlement,
        abi: ABIS.FGOFuturesSettlement,
        functionName: "increaseStake",
        args: [stakeAmount * 10 ** 18],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict?.registerBotStakeIncreaseSuccess, hash);
      await checkAllowance();
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

      context?.showSuccess(dict?.registerBotStakeWithdrawSuccess, hash);
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

      context?.showSuccess(dict?.registerBotClaimSuccess, hash);
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
    checkAllowance();
  }, [checkAllowance]);

  useEffect(() => {
    if (Number(context?.settlementBots?.length) < 1 && !settlementBotsLoading) {
      getAllSettlementBots(true);
    }
  }, []);

  const loadMoreSettlementBots = useCallback(() => {
    if (!settlementBotsLoading && hasMoreSettlementBots) {
      getAllSettlementBots(false);
    }
  }, [getAllSettlementBots, settlementBotsLoading, hasMoreSettlementBots]);

  return {
    registerSettlementLoading,
    handleRegisterSettlement,
    stakeAmount,
    setStakeAmount,
    handleIncreaseStake,
    handleWithdrawStake,
    stakeLoading,
    approveStake,
    approveLoading,
    isStakeApproved,
    settlementBot,
    handleClaimChildSettled,
    claimLoading,
    settlementBotsLoading,
    hasMoreSettlementBots,
    loadMoreSettlementBots,
  };
};

export default useRegisterBot;
