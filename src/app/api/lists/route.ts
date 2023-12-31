import { NextResponse } from "next/server";
import * as z from "zod";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createListSchema } from "@/lib/validations/list";

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    console.log("json: ", json);

    const body = createListSchema.parse(json);

    // Create list
    const list = await prisma.list.create({
      data: {
        name: body.name,
        userId: user.id,
        type: body.type,
        params: {
          tokenAddress: body.params.tokenAddress,
          amount: body.params.amount,
          chainId: body.params.chainId,
        },
        contacts: body.contacts,
      },
    });

    return NextResponse.json(list);
  } catch (error) {
    console.error("Error: ", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
