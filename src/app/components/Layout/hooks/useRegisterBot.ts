import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { AppContext } from "@/app/lib/providers/Providers";
import { use, useContext, useEffect, useState } from "react";
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
  const [validBalance, setValidBalance] = useState<{
    dltaBalance: bigint;
    genesisBalance: bigint;
  }>({
    dltaBalance: BigInt(0),
    genesisBalance: BigInt(0),
  });
  const [stakeAmount, setStakeAmount] = useState<number>(0);
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

  const getAllSettlementBots = async () => {
    if (!address) return;
    try {
      const data = await getSettlementBotsAll();
      context?.setSettlementBots(data?.data?.settlementBots);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const checkMonaBalance = async (): Promise<boolean> => {
    if (!address || !publicClient) return false;

    try {
      const mona = await publicClient.readContract({
        address: contracts.mona,
        abi: [
          {
            type: "function",
            name: "balanceOf",
            inputs: [
              { name: "owner", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
          },
        ],
        functionName: "balanceOf",
        args: [address],
      });

      if (Number(mona) < stakeAmount) {
        return false;
      } else {
        return true;
      }
    } catch (err: any) {
      console.error(err.message);
      return false;
    }
  };

  const handleRegisterSettlement = async () => {
    if (!walletClient || !publicClient || !address) return;
    setRegisterSettlementLoading(true);
    try {
      const valid = await checkMonaBalance();
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
      const valid = await checkMonaBalance();
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

  const getValidTokens = async (): Promise<void> => {
    if (!address || !publicClient) return;

    try {
      const [dltaBalance, genesisBalance] = await Promise.all([
        publicClient.readContract({
          address: contracts.dlta,
          abi: [
            {
              type: "function",
              name: "balanceOf",
              inputs: [
                { name: "owner", type: "address", internalType: "address" },
              ],
              outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
              stateMutability: "view",
            },
          ],
          functionName: "balanceOf",
          args: [address],
        }),
        publicClient.readContract({
          address: contracts.genesis,
          abi: [
            {
              type: "function",
              name: "balanceOf",
              inputs: [
                { name: "owner", type: "address", internalType: "address" },
              ],
              outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
              stateMutability: "view",
            },
          ],
          functionName: "balanceOf",
          args: [address],
        }),
      ]);

      setValidBalance({
        dltaBalance,
        genesisBalance,
      });
    } catch (error: any) {
      console.error((error as any).message);
      context?.showError(error?.message);
    }
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
    if (
      address &&
      validBalance.dltaBalance == BigInt(0) &&
      validBalance.genesisBalance == BigInt(0)
    ) {
      getValidTokens();
    }
  }, [address]);

  useEffect(() => {
    if (address && !settlementBot) {
      getUserSettlementBot();
    }
  }, [address]);

  useEffect(() => {
    if (context && context?.settlementBots?.length < 1) {
      getAllSettlementBots();
    }
  }, [context]);

  return {
    registerSettlementLoading,
    handleRegisterSettlement,
    stakeAmount,
    setStakeAmount,
    validBalance,
    handleIncreaseStake,
    handleWithdrawStake,
    stakeLoading,
    settlementBot,
    handleClaimChildSettled,
    claimLoading,
  };
};

export default useRegisterBot;
