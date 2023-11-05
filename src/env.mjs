import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    RPC_POLYGON_ZKEVM_TESTNET: z.string().optional(),
    RPC_COREDAO_TESTNET: z.string().optional(),
    NOTIFY_API_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CHAIN: z.union([
      z.literal("localhost"),
      z.literal("testnet"),
      z.literal("mainnet"),
    ]),
    NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().min(1),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_EMBED_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_DOMAIN: z.string().optional(),
  },
  // Only need to destructure client variables
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CHAIN: process.env.NEXT_PUBLIC_CHAIN,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_EMBED_URL: process.env.NEXT_PUBLIC_EMBED_URL,
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
