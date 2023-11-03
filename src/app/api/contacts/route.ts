import { NextResponse } from "next/server";
import * as z from "zod";

import { prisma } from "@/lib/prisma";
import { createContactSchema } from "@/lib/validations/contact";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = createContactSchema.parse(json);

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        address: body.address,
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
