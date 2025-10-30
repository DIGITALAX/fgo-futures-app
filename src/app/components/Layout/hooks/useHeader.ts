import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { AppContext } from "@/app/lib/providers/Providers";
import { useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";

const useHeader = () => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  const getStats = async () => {
    if (!publicClient || !address) return;
    setStatsLoading(true);
    try {
      const [monaBalance, ionicBalance, genesisBalance, currentBlock] =
        await Promise.all([
          publicClient.readContract({
            address: contracts.mona,
            abi: [
              {
                type: "function",
                name: "balanceOf",
                inputs: [
                  { name: "owner", type: "address", internalType: "address" },
                ],
                outputs: [
                  { name: "", type: "uint256", internalType: "uint256" },
                ],
                stateMutability: "view",
              },
            ],
            functionName: "balanceOf",
            args: [address],
          }),
          publicClient.readContract({
            address: contracts.ionic,
            abi: [
              {
                type: "function",
                name: "balanceOf",
                inputs: [
                  { name: "owner", type: "address", internalType: "address" },
                ],
                outputs: [
                  { name: "", type: "uint256", internalType: "uint256" },
                ],
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
                outputs: [
                  { name: "", type: "uint256", internalType: "uint256" },
                ],
                stateMutability: "view",
              },
            ],
            functionName: "balanceOf",
            args: [address],
          }),
          publicClient.getBlock(),
        ]);

        console.log(monaBalance);
      context?.setStats({
        mona: Number(monaBalance) / 10 ** 18,
        ionic: Number(ionicBalance),
        genesis: Number(genesisBalance),
        blockTimestamp: Number(currentBlock.timestamp),
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setStatsLoading(false);
  };

  const updateBlockTimestamp = async () => {
    if (!publicClient) return;

    try {
      const currentBlock = await publicClient.getBlock();
      context?.setStats((prev) => ({
        ...prev,
        blockTimestamp: Number(currentBlock.timestamp),
      }));
    } catch (err: any) {
      console.error("Failed to update block timestamp:", err.message);
    }
  };

  useEffect(() => {
    if (
      !statsLoading &&
      address &&
      publicClient &&
      context &&
      Object.values(context?.stats).every((val) => val == 0)
    )
      getStats();
  }, [address, publicClient, context, context?.hideSuccess]);

  useEffect(() => {
    updateBlockTimestamp();
    const interval = setInterval(updateBlockTimestamp, 30000);
    return () => clearInterval(interval);
  }, [publicClient]);

  return {
    statsLoading,
  };
};

export default useHeader;
