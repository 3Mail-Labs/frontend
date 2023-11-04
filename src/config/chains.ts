import { defineChain } from "viem";
import { hardhat, polygon, polygonMumbai } from "wagmi/chains";

import { env } from "@/env.mjs";
import HardhatIcon from "@/icons/hardhat.svg";
import PolygonIcon from "@/icons/polygon.svg";

export type ChainMap = { [chainId: number]: string };

export const iexec = defineChain({
  id: 134,
  name: "iExec Sidechain",
  network: "iexec",
  nativeCurrency: {
    decimals: 18,
    name: "xRLC",
    symbol: "xRLC",
  },
  rpcUrls: {
    default: {
      http: ["https://bellecour.iex.ec"],
    },
    public: {
      http: ["https://bellecour.iex.ec"],
    },
  },
  blockExplorers: {
    default: { name: "BlockScout", url: "https://blockscout-bellecour.iex.ec/" },
  },
  testnet: false,
});

const getChains = () => {
  switch (env.NEXT_PUBLIC_CHAIN) {
    case "localhost":
      return [iexec];
    case "testnet":
      return [iexec];
    case "mainnet":
      throw [iexec];
    default:
      throw new Error("Invalid NEXT_PUBLIC_CHAIN value");
  }
};

export const CHAINS = getChains();

type Icon = (className: { className?: string }) => JSX.Element;

export const CHAIN_ICON: { [chainId: number]: Icon } = {
  [hardhat.id]: HardhatIcon,
  [polygonMumbai.id]: PolygonIcon,
  [polygon.id]: PolygonIcon,
  [iexec.id]: HardhatIcon,
};
