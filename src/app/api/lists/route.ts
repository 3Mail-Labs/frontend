import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import * as z from "zod";

import { prisma } from "@/lib/prisma";
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
        contacts: {
          createMany: {
            data: body.contacts.map((contact) => ({
              contactAddress: contact,
            })),
          },
        },
      },
    });

    return NextResponse.json(list);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
