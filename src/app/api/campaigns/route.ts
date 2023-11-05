import { NextResponse } from "next/server";
import * as z from "zod";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createCampaignSchema } from "@/lib/validations/campaign";

const schema = createCampaignSchema.extend({
  contacts: z.array(z.string()),
  taskIds: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = schema.parse(json);

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        content: body.content,
        subject: body.subject,
        description: body.description,
        listId: body.listId,
        userId: user.id,
        taskIds: body.taskIds,
        type: body.type,
      },
    });

    // Update contact access count
    await prisma.contact.updateMany({
      where: {
        address: {
          in: body.contacts,
        },
        numberOfAccess: {
          gt: 0,
        },
      },
      data: {
        numberOfAccess: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error: ", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
