import { ethers } from "ethers";
import { NextResponse } from "next/server";
import * as z from "zod";

import { erc20Abi } from "@/abis/erc20";
import { erc721Abi } from "@/abis/erc721";
import { POLYGON_ZKSYNC_TESTNET_CHAIN_ID } from "@/config/chains";
import { env } from "@/env.mjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const RPC_POLYGON_ZKEVM_TESTNET =
  env.RPC_POLYGON_ZKEVM_TESTNET || "https://rpc.public.zkevm-test.net";
const RPC_COREDAO_TESTNET = env.RPC_COREDAO_TESTNET || "https://rpc.test.btcs.network";

const polygonZKEVMProvider = new ethers.providers.JsonRpcProvider(RPC_POLYGON_ZKEVM_TESTNET);
const coreDAOProvider = new ethers.providers.JsonRpcProvider(RPC_COREDAO_TESTNET);

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function GET(req: Request, context: z.infer<typeof routeContextSchema>) {
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

    // Filter by list criteria
    const filteredContacts = contacts.filter((contact) => {
      const provider =
        Number(chainId) === POLYGON_ZKSYNC_TESTNET_CHAIN_ID
          ? polygonZKEVMProvider
          : coreDAOProvider;

      switch (list.type) {
        case "nft":
          const nftContract = new ethers.Contract(tokenAddress, erc721Abi, provider);
          if (nftContract.balanceOf(contact.address).gte(ethers.BigNumber.from(amount))) {
            return true;
          }
          break;
        case "token":
          const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
          if (tokenContract.balanceOf(contact.address).gte(ethers.BigNumber.from(amount))) {
            return true;
          }
          break;

        default:
          return false;
          break;
      }
    });

    return NextResponse.json(filteredContacts);
  } catch (error) {
    console.error("Error: ", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
