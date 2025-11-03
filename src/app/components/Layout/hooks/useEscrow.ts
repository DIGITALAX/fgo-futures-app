import { useState, useEffect, useContext } from "react";
import {
  getEscrowedRightsAll,
  getEscrowedRightsBuyer,
} from "@/app/lib/subgraph/queries/getEscrowedRights";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { EscrowedRight, RightsAction } from "../types/layout.types";
import { AppContext } from "@/app/lib/providers/Providers";
import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ensureMetadata } from "@/app/lib/utils";

const useEscrow = (dict: any) => {
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

  const handleDepositPhysicalRights = async (chosenRights: RightsAction) => {
    if (!walletClient || !publicClient || !address || !chosenRights) return;

    const { childId, orderId, amount, originalMarket, childContract, key } =
      chosenRights;

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

      context?.showSuccess(dict?.escrowDepositSuccess, hash);
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

    const { childId, orderId, amount, originalMarket, childContract, key } =
      chosenRights;

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

      context?.showSuccess(dict?.escrowWithdrawSuccess, hash);
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
      let allRights = res?.data?.escrowedRights;
      if (!allRights || allRights.length < 20) {
        setHasMoreEscrowedRights(false);
      }

      allRights = await Promise.all(
        allRights.map(async (right: EscrowedRight) => {
          const contractsData = await Promise.all(
            (right?.contracts || []).map(async (item) => {
              let balanceOf = 0;

              if (publicClient && address && item.tokenId) {
                const res = await publicClient.readContract({
                  address: contracts.trading,
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
                  args: [address, BigInt(item.tokenId)],
                });
                balanceOf += Number(res);
              }
              return {
                ...(await ensureMetadata(item)),
                balanceOf,
              };
            })
          );

          return {
            ...right,
            contracts: contractsData,
          };
        })
      );

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
    if (!address || !publicClient) {
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

      allRights = await Promise.all(
        allRights.map(async (right: EscrowedRight) => {
          const contractsData = await Promise.all(
            (right?.contracts || []).map(async (item) => {
              let balanceOf = 0;

              if (publicClient && address && item.tokenId) {
                const res = await publicClient.readContract({
                  address: contracts.trading,
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
                  args: [address, BigInt(item.tokenId)],
                });
                balanceOf += Number(res);
              }
              return {
                ...(await ensureMetadata(item)),
                balanceOf,
              };
            })
          );

          return {
            ...right,
            contracts: contractsData,
          };
        })
      );


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
    if (escrowedRights?.length < 1 && publicClient) {
      getEscrowAll(true);
    }
  }, [context?.hideSuccess, publicClient]);

  useEffect(() => {
    if (escrowedRightsUser?.length < 1 && address && publicClient) {
      getEscrowUser(true);
    }
  }, [address, context?.hideSuccess, publicClient]);

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
