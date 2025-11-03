import { useState, useEffect, useContext } from "react";
import { FutureCredit, SupplyFuture } from "../types/layout.types";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { AppContext } from "@/app/lib/providers/Providers";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ABIS } from "@/abis";
import {
  getSupplyFuturesSettlement,
  getFutureCredits,
} from "@/app/lib/subgraph/queries/getAllChildren";

const useSettleSupply = (dict: any) => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);
  const [contractsSettled, setContractsSettled] = useState<SupplyFuture[]>([]);
  const [contractsLoading, setContractsLoading] = useState<boolean>(false);
  const [loadingKeys, setLoadingKeys] = useState<{ [key: string]: boolean }>({});
  const [contractsSkip, setContractsSkip] = useState<number>(0);
  const [hasMoreContracts, setHasMoreContracts] = useState<boolean>(true);
  const [creditsSkip, setCreditsSkip] = useState<number>(0);
  const [hasMoreCredits, setHasMoreCredits] = useState<boolean>(true);
  const [credits, setCredits] = useState<FutureCredit[]>([]);
  const [creditsLoading, setCreditsLoading] = useState<boolean>(false);

  const getClaimedCredits = async (reset: boolean = false) => {
    setCreditsLoading(true);
    try {
      const skipValue = reset ? 0 : creditsSkip;
      const data = await getFutureCredits(20, skipValue);

      let allCredits = data?.data?.futureCredits;

      if (!allCredits || allCredits.length < 20) {
        setHasMoreCredits(false);
      }

      if (reset) {
        setCredits(allCredits);
        setCreditsSkip(20);
      } else {
        setCredits((prev) => [
          ...prev,
          ...(allCredits?.length < 1 ? [] : allCredits),
        ]);
        setCreditsSkip((prev) => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCreditsLoading(false);
  };

  const getSupplyContracts = async (reset: boolean = false) => {
    setContractsLoading(true);
    try {
      const skipValue = reset ? 0 : contractsSkip;
      const data = await getSupplyFuturesSettlement(20, skipValue);

      let allContracts = data?.data?.futurePositions;

      allContracts = await Promise.all(
        allContracts.map(async (con: any) => {
          let balanceOf = 0,
            reservedAmount = 0;

          if (publicClient && address && con?.tokenId) {
            const res = await publicClient.readContract({
              address: contracts.futuresCoordination,
              abi: [
                {
                  type: "function",
                  name: "balanceOf",
                  inputs: [
                    {
                      name: "account",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "id",
                      type: "uint256",
                      internalType: "uint256",
                    },
                  ],
                  outputs: [
                    {
                      name: "",
                      type: "uint256",
                      internalType: "uint256",
                    },
                  ],
                  stateMutability: "view",
                },
              ],
              functionName: "balanceOf",
              args: [address, BigInt(con?.tokenId)],
            });
            balanceOf = Number(res);

            const reserved = await publicClient.readContract({
              address: contracts.futuresCoordination,
              abi: ABIS.FGOFuturesCoordination,
              functionName: "getReservedTokenAmounts",
              args: [address, BigInt(con?.tokenId)],
            });
            reservedAmount = Number(reserved);
          }
          return {
            ...con,
            balanceOf,
            reservedAmount,
          };
        })
      );

      if (!allContracts || allContracts.length < 20) {
        setHasMoreContracts(false);
      }

      if (reset) {
        setContractsSettled(allContracts);
        setContractsSkip(20);
      } else {
        setContractsSettled((prev) => [
          ...prev,
          ...(allContracts?.length < 1 ? [] : allContracts),
        ]);
        setContractsSkip((prev) => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setContractsLoading(false);
  };

  const handleSettleFutures = async (tokenId: string) => {
    if (!walletClient || !publicClient || !address) return;
    const key = `settle-${tokenId}`;
    setLoadingKeys((prev) => ({ ...prev, [key]: true }));

    try {
      const futureContract = contractsSettled?.find(
        (item) => BigInt(tokenId).toString() == BigInt(item.tokenId).toString()
      );

      if (!futureContract) {
        context?.showError(dict.settleSupplyContractNotFound);
        setLoadingKeys((prev) => ({ ...prev, [key]: false }));
        return;
      }

      const now = Date.now() / 1000;
      const deadline = Number(futureContract?.deadline);

      if (deadline !== 0 && deadline > now) {
        context?.showError(dict.settleSupplyDeadlinePending);
        setLoadingKeys((prev) => ({ ...prev, [key]: false }));
        return;
      }

      const hash = await walletClient.writeContract({
        address: contracts.futuresCoordination,
        abi: ABIS.FGOFuturesCoordination,
        functionName: "settleFutures",
        args: [BigInt(tokenId)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict.settleSupplySettlementSuccess, hash);
      getSupplyContracts(true);
    } catch (err: any) {
      context?.showError(err.message);
    } finally {
      setLoadingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleClaimCredits = async (tokenId: string, amount: string) => {
    if (!walletClient || !publicClient || !address) return;
    const key = `claim-${tokenId}`;
    setLoadingKeys((prev) => ({ ...prev, [key]: true }));

    try {
      const futureContract = contractsSettled?.find(
        (item) => BigInt(tokenId).toString() == BigInt(item.tokenId).toString()
      );

      if (!futureContract) {
        context?.showError(dict.settleSupplyContractNotFound);
        setLoadingKeys((prev) => ({ ...prev, [key]: false }));
        return;
      }

      if (!futureContract?.isSettled) {
        context?.showError(dict.settleSupplyNotSettled);
        setLoadingKeys((prev) => ({ ...prev, [key]: false }));
        return;
      }

      if (futureContract?.balanceOf === 0) {
        context?.showError(dict.settleSupplyNoBalance);
        setLoadingKeys((prev) => ({ ...prev, [key]: false }));
        return;
      }

      const hash = await walletClient.writeContract({
        address: contracts.futuresCoordination,
        abi: ABIS.FGOFuturesCoordination,
        functionName: "consumeFuturesCredits",
        args: [
          futureContract.child.childContract as `0x${string}`,
          address,
          BigInt(futureContract.child.childId),
          BigInt(amount),
        ],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict.settleSupplyClaimSuccess, hash);
      getSupplyContracts(true);
      getClaimedCredits(true);
    } catch (err: any) {
      context?.showError(err.message);
    } finally {
      setLoadingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    if (contractsSettled?.length < 1) {
      getSupplyContracts(true);
    }
  }, [address]);

  useEffect(() => {
    if (credits?.length < 1 && !creditsLoading && address) {
      getClaimedCredits(true);
    }
  }, [address]);

  const loadMoreContracts = () => {
    if (!contractsLoading && hasMoreContracts) {
      getSupplyContracts(false);
    }
  };

  const loadMoreCredits = () => {
    if (!creditsLoading && hasMoreCredits) {
      getClaimedCredits(false);
    }
  };

  return {
    contractsSettled,
    contractsLoading,
    handleSettleFutures,
    handleClaimCredits,
    loadingKeys,
    hasMoreContracts,
    loadMoreContracts,
    loadMoreCredits,
    credits,
    creditsLoading,
  };
};

export default useSettleSupply;
