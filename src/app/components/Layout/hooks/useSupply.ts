import { useContext, useEffect, useState, useCallback } from "react";
import { SupplyFuture } from "../types/layout.types";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { AppContext } from "@/app/lib/providers/Providers";
import {
  getSupplyFutures,
  getSupplyFuturesBuyer,
} from "@/app/lib/subgraph/queries/getAllChildren";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ABIS } from "@/abis";

const useSupply = (dict: any) => {
  const { address } = useAccount();
  const context = useContext(AppContext);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [supply, setSupply] = useState<SupplyFuture[]>([]);
  const [userSupply, setUserSupply] = useState<SupplyFuture[]>([]);
  const [supplyLoading, setSupplyLoading] = useState<boolean>(false);
  const [userSupplyLoading, setUserSupplyLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [loadingKeys, setLoadingKeys] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [buyAmounts, setBuyAmounts] = useState<{ [key: string]: number }>({});
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [isMonaApproved, setIsMonaApproved] = useState<boolean>(false);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);
  const [supplySkip, setSupplySkip] = useState<number>(0);
  const [userSupplySkip, setUserSupplySkip] = useState<number>(0);
  const [hasMoreSupply, setHasMoreSupply] = useState<boolean>(true);
  const [hasMoreUserSupply, setHasMoreUserSupply] = useState<boolean>(true);

  const getSupply = async (reset: boolean = false) => {
    setSupplyLoading(true);
    try {
      const skipValue = reset ? 0 : supplySkip;
      const data = await getSupplyFutures(20, skipValue);
      let allSupply = data?.data?.futurePositions;

      if (!allSupply || allSupply.length < 20) {
        setHasMoreSupply(false);
      }

      if (reset) {
        setSupply(allSupply || []);
        setSupplySkip(20);
      } else {
        setSupply((prev) => [...prev, ...(allSupply || [])]);
        setSupplySkip((prev) => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSupplyLoading(false);
  };

  const getUserSupply = async (reset: boolean = false) => {
    if (!address) return;
    setUserSupplyLoading(true);
    try {
      const skipValue = reset ? 0 : userSupplySkip;
      const data = await getSupplyFuturesBuyer(address, 20, skipValue);
      let allUserSupply = data?.data?.futurePositions;

      if (!allUserSupply || allUserSupply.length < 20) {
        setHasMoreUserSupply(false);
      }

      if (reset) {
        setUserSupply(allUserSupply || []);
        setUserSupplySkip(20);
      } else {
        setUserSupply((prev) => [...prev, ...(allUserSupply || [])]);
        setUserSupplySkip((prev) => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setUserSupplyLoading(false);
  };

  useEffect(() => {
    if (supply.length < 1) {
      getSupply(true);
    }
  }, [context?.hideSuccess]);

  useEffect(() => {
    if (userSupply.length < 1 && address) {
      getUserSupply(true);
    }
  }, [address, context?.hideSuccess]);

  const loadMoreSupply = () => {
    if (!supplyLoading && hasMoreSupply) {
      getSupply(false);
    }
  };

  const loadMoreUserSupply = () => {
    if (!userSupplyLoading && hasMoreUserSupply) {
      getUserSupply(false);
    }
  };

  const checkAllowance = useCallback(
    async (amount: number): Promise<boolean> => {
      if (!publicClient || !address) {
        setIsMonaApproved(false);
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
          args: [
            address as `0x${string}`,
            contracts.futuresCoordination as `0x${string}`,
          ],
        })) as bigint;

        const approved = allowance >= BigInt(amount * 10 ** 18);
        setIsMonaApproved(approved);
        return approved;
      } catch (err: any) {
        console.error(err?.message || err);
        setIsMonaApproved(false);
        return false;
      }
    },
    [publicClient, address, contracts.mona, contracts.futuresCoordination]
  );

  const approveMona = useCallback(
    async (amount: number): Promise<boolean> => {
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
            contracts.futuresCoordination as `0x${string}`,
            BigInt(amount * 10 ** 18),
          ],
          account: address,
        });

        await publicClient.waitForTransactionReceipt({ hash });

        context?.showSuccess(dict?.supplyApproveSuccess, hash);
        await checkAllowance(amount);
        return true;
      } catch (err: any) {
        console.error(err.message);
        context?.showError(err.message);
        return false;
      } finally {
        setApproveLoading(false);
      }
    },
    [
      walletClient,
      publicClient,
      address,
      contracts.mona,
      contracts.futuresCoordination,
      context,
      checkAllowance,
    ]
  );

  const handleBuyFutures = async (
    loadingKey: string,
    tokenId: string,
    amount: string,
    pricePerUnit: string
  ) => {
    if (!address || !walletClient || !publicClient) return;
    const key = loadingKey;
    const buyAmount = Number(amount);
    const totalCost = buyAmount * (Number(pricePerUnit) / 10 ** 18);

    setLoadingKeys((prev) => ({ ...prev, [key]: true }));

    try {
      const approved = await checkAllowance(totalCost);
      if (!approved) {
        context?.showError(dict?.supplyApprovePrompt);
        setLoadingKeys((prev) => ({ ...prev, [key]: false }));
        return;
      }

      const hash = await walletClient.writeContract({
        address: contracts.futuresCoordination as `0x${string}`,
        abi: ABIS.FGOFuturesCoordination,
        functionName: "buyFutures",
        args: [BigInt(tokenId).toString(), BigInt(amount)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict?.supplyPurchaseSuccess, hash);
    } catch (err: any) {
      console.error(err);
      context?.showError(err.message);
    } finally {
      setLoadingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  return {
    supply,
    supplyLoading,
    userSupply,
    userSupplyLoading,
    hasMoreSupply,
    hasMoreUserSupply,
    loadMoreSupply,
    loadMoreUserSupply,
    activeTab,
    setActiveTab,
    handleBuyFutures,
    loadingKeys,
    buyAmounts,
    setBuyAmounts,
    approveMona,
    approveLoading,
    isMonaApproved,
    checkAllowance,
  };
};

export default useSupply;
