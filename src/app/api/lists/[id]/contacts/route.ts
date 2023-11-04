"use server"

import { ethers } from "ethers";
import { NextResponse } from "next/server";
import {  z } from "zod";

import {  createPublicClient, getContract, http} from 'viem'

import { erc20Abi } from "@/abis/erc20";
import { erc721Abi } from "@/abis/erc721";
import { env } from "@/env.mjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { polygonZkEvmTestnet } from "viem/chains";

const POLYGON_ZKSYNC_TESTNET_CHAIN_ID = 1442;
// const CORE_TESTNET_CHAIN_ID = 1115;

// const RPC_POLYGON_ZKEVM_TESTNET = "https://rpc.public.zkevm-test.net";
// const RPC_COREDAO_TESTNET = env.RPC_COREDAO_TESTNET || "https://rpc.test.btcs.network";

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
    const chain = Number(chainId) === POLYGON_ZKSYNC_TESTNET_CHAIN_ID ? polygonZkEvmTestnet : polygonZkEvmTestnet;

    const client = createPublicClient({ 
      chain,
      transport: http()
    })

    const abi = list.type === "nft" ? erc721Abi : erc20Abi;
    

    const contract = getContract({
      address: tokenAddress as `0x${string}`,
      abi,
      publicClient: client,
    })

    const filteredContacts = [];

    for (const contact of contacts) {
      const balance = await contract.read.balanceOf([contact.address])
      console.log("Balance: ", balance);

      if (Number(balance) > Number(amount)) {
        console.log("Contact: ", contact);
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
