import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import * as z from "zod";

import { prisma } from "@/lib/prisma";
import { createContactSchema } from "@/lib/validations/contact";

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = createContactSchema.parse(json);

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        address: body.address,
        userId: user.id,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
