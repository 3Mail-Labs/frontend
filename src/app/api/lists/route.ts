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
    const body = createListSchema.parse(json);

    // Create list
    const list = await prisma.list.create({
      data: {
        name: body.name,
        userId: user.id,
        type: body.type,
        params: {
          tokenAddress: body.params.tokenAddress,
        },
        contacts: {
          create: body.contacts.map((contact) => ({
            address: contact,
            userId: user.id,
          })),
        },
      },
    });

    return NextResponse.json(list);
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
