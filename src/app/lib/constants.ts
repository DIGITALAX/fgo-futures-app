import { CoreContractAddresses } from "../components/Layout/types/layout.types";

export const LOCALES: string[] = ["en", "es", "pt", "fr", "yi", "gd"];

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
    escrow: "0xee8B5b5b582Dc5D31651b10579236dB74f5B6168",
    futures: "0x118558e1351FE59D2ebF6C3421045eBE9fD71ed8",
    trading: "0x0C8A98Bd8152F855d918e9606b354a0caC61F1aF",
    settlement: "0x7099069Dc36e49E1C158f7ce9a6A0eab62A695c4",
    futuresCoordination: "0xa9E055bec825D0D27b15dD4cF78BEB6C89c5Db7E",
    ionic: "0x838615573ba0b218d48E1D29D89EFC3651394937",
    genesis: "0x838615573ba0b218d48E1D29D89EFC3651394937",
    mona: "0x3D7f4Fc4E17Ead2ABBcf282A38F209D683e03835",
  },
  [NETWORKS.LENS_MAINNET.chainId]: {
    futures: "0x",
    escrow: "0x",
    futuresCoordination: "0x",
    ionic: "0x",
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
