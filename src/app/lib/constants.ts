import { CoreContractAddresses } from "../components/Layout/types/layout.types";

export const LOCALES: string[] = ["en", "es", "pt"];

export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io/ipfs/";

export const NETWORKS = {
  LENS_TESTNET: {
    chainId: 37111,
    name: "Lens Network Testnet",
    rpcUrl: "https://rpc.testnet.lens.dev",
    blockExplorer: "https://block-explorer.testnet.lens.dev",
  },
  LENS_MAINNET: {
    chainId: 232,
    name: "Lens Network",
    rpcUrl: "https://rpc.lens.dev",
    blockExplorer: "https://explorer.lens.xyz",
  },
} as const;

export type NetworkConfig = (typeof NETWORKS)[keyof typeof NETWORKS];

export const DEFAULT_NETWORK =
  process.env.NODE_ENV === "production"
    ? NETWORKS.LENS_MAINNET
    : NETWORKS.LENS_TESTNET;

export const getCurrentNetwork = (): NetworkConfig => {
  const isMainnet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";
  return isMainnet ? NETWORKS.LENS_MAINNET : NETWORKS.LENS_TESTNET;
};

export const CORE_CONTRACT_ADDRESSES: Record<number, CoreContractAddresses> = {
  [NETWORKS.LENS_TESTNET.chainId]: {
    futures: "0x",
    escrow: "0x",
    child: "0x",
    dlta: "0x",
    genesis: "0x",
    settlement: "0x",
    trading: "0x",
    mona: "0x",
  },
  [NETWORKS.LENS_MAINNET.chainId]: {
    futures: "0x",
    escrow: "0x",
    child: "0x",
    dlta: "0x",
    genesis: "0x",
    settlement: "0x",
    trading: "0x",
    mona: "0x",
  },
};

export const FLASH_PATTERNS: string[] = [
  "flash-quick",
  "flash-long",
  "flash-pulse",
  "flash-burst",
];

export const getCoreContractAddresses = (
  chainId: number
): CoreContractAddresses => {
  const addresses = CORE_CONTRACT_ADDRESSES[chainId];
  if (!addresses) {
    throw new Error(
      `Core contract addresses not found for chain ID: ${chainId}`
    );
  }
  return addresses;
};
