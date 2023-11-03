import { NextResponse } from "next/server";
import * as z from "zod";

import { prisma } from "@/lib/prisma";
import { createCampaignSchema } from "@/lib/validations/campaign";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = createCampaignSchema.parse(json);

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        content: body.content,
        subject: body.subject,
        description: body.description,
        listId: body.listId,
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}