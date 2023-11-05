"use client";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { WagmiConfig } from "wagmi";

import { CHAINS } from "@/config/chains";
import { env } from "@/env.mjs";

const projectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const metadata = {
  name: "Web3Starter",
  description: "Web3 Frontend Starter",
  url: "http://3mail-dashboard.vercel.app",
  // icons: ["http://localhost:3000/icon.png"],
};

const wagmiConfig = defaultWagmiConfig({ chains: CHAINS, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains: CHAINS });

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
