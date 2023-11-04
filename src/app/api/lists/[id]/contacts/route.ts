import { NextResponse } from "next/server";
import { createPublicClient, defineChain, getContract, http } from "viem";
import { polygonZkEvmTestnet } from "viem/chains";
import { z } from "zod";

import { erc20Abi } from "@/abis/erc20";
import { erc721Abi } from "@/abis/erc721";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const POLYGON_ZKSYNC_TESTNET_CHAIN_ID = 1442;

export const coreTestnet = defineChain({
  id: 1115,
  name: "Core Blockchain Testnet",
  network: "core-blockchain-testnet",
  nativeCurrency: { name: "tCORE", symbol: "tCORE", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.test.btcs.network"],
    },
    public: {
      http: ["https://rpc.test.btcs.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "CoreScan",
      url: "https://scan.test.btcs.network",
    },
  },
  testnet: true,
  contracts: {},
});

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function GET(_: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context);

    // Check if user is authenticated
    const session = await getSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const [list, contacts] = await Promise.all([
      prisma.list.findUnique({
        where: {
          id: params.id,
          userId: user.id,
        },
      }),
      prisma.contact.findMany({
        where: {
          userId: user.id,
        },
      }),
    ]);

    if (!list) {
      return NextResponse.json("List not found", { status: 404 });
    }

    if (typeof list.params !== "object" || Array.isArray(list.params)) {
      throw new Error("List params must be an object");
    }

    const { chainId, tokenAddress, amount } = list.params as Record<string, string>;
    const chain =
      Number(chainId) === POLYGON_ZKSYNC_TESTNET_CHAIN_ID ? polygonZkEvmTestnet : coreTestnet;

    const client = createPublicClient({
      chain,
      transport: http(),
    });

    const abi = list.type === "nft" ? erc721Abi : erc20Abi;

    const contract = getContract({
      address: tokenAddress as `0x${string}`,
      abi,
      publicClient: client,
    });

    const filteredContacts = [];

    for (const contact of contacts) {
      const balance = await contract.read.balanceOf([contact.address]);

      if (Number(balance) > Number(amount)) {
        filteredContacts.push(contact);
      }
    }

    return NextResponse.json(filteredContacts);
  } catch (error) {
    console.error(">> Error: ", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
