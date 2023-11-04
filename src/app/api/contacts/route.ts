import { NextResponse } from "next/server";
import * as z from "zod";

import { prisma } from "@/lib/prisma";
import { createContactSchema } from "@/lib/validations/contact";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = createContactSchema.parse(json);

    // Find user by address
    const user = await prisma.user.findUnique({
      where: {
        address: body.userAddress,
      },
    });

    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        address: body.address,
        userId: user.id,
        numberOfAccess: body.numberOfAccess,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.log("Error: ", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}

export function OPTIONS(): NextResponse<any> {
  const res = new NextResponse();

  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "POST");
  res.headers.set("Access-Control-Allow-Headers", "*");

  return res;
}
