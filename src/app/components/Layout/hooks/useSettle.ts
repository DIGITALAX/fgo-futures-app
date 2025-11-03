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

const useSettle = (dict: any) => {
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
  const [loadingKeys, setLoadingKeys] = useState<{ [key: string]: boolean }>({});
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

      allContracts = await Promise.all(
        allContracts.map(async (con: any) => {
          let balanceOf = 0;

          if (publicClient && address && con?.tokenId) {
            const res = await publicClient.readContract({
              address: contracts.futures,
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
          }
          return {
            ...con,
            balanceOf,
          };
        })
      );

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

  const handleEmergencySettle = async (contractId: number) => {
    if (!walletClient || !publicClient || !address) return;
    const key = `settle-${contractId}`;
    setLoadingKeys((prev) => ({ ...prev, [key]: true }));
    try {
      const hash = await walletClient.writeContract({
        address: contracts.settlement,
        abi: ABIS.FGOFuturesSettlement,
        functionName: "emergencySettleFuturesContract",
        args: [contractId],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict.settleEmergencySuccess, hash);
      getContracts(true);
    } catch (err: any) {
      context?.showError(err.message);
    } finally {
      setLoadingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  const claimChildSettlement = async (contractId: number) => {
    if (!walletClient || !publicClient || !address) return;
    const key = `claim-${contractId}`;
    setLoadingKeys((prev) => ({ ...prev, [key]: true }));

    try {
      const contract = contractsSettled?.find(
        (c) => Number(c.contractId) === contractId
      );

      if (
        !contract ||
        Number(contract?.balanceOf) < 1 ||
        !contract?.isSettled ||
        !contract?.isFulfilled
      ) {
        context?.showError(dict.settleClaimUnavailable);
        setLoadingKeys((prev) => ({ ...prev, [key]: false }));
        return;
      }

      const hash = await walletClient.writeContract({
        address: contracts.escrow,
        abi: ABIS.FGOFuturesEscrow,
        functionName: "claimChildAfterSettlement",
        args: [BigInt(contractId)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict.settleClaimSuccess, hash);
      getContracts(true);
    } catch (err: any) {
      context?.showError(err.message);
    } finally {
      setLoadingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    if (contractsSettled?.length < 1) {
      getContracts(true);
    }
  }, [address]);

  const loadMoreContracts = () => {
    if (!contractsLoading && hasMoreContracts) {
      getContracts(false);
    }
  };

  return {
    contractsSettled,
    contractsLoading,
    handleEmergencySettle,
    claimChildSettlement,
    loadingKeys,
    hasMoreContracts,
    loadMoreContracts,
  };
};

export default useSettle;
