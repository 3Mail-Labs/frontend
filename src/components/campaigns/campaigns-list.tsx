import { cache } from "react";

import { NoCampaignsPlaceholder } from "@/components/campaigns/no-campaigns-placeholder";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

import { CampaignsTable } from "./campaigns-table";

const getCampaigns = cache(async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const campaign = await prisma.campaign.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      list: true,
    },
  });

  return campaign;
});

export async function CampaignsList() {
  const campaigns = await getCampaigns();

  if (!campaigns || campaigns.length === 0) {
    return <NoCampaignsPlaceholder />;
  }

  return <CampaignsTable campaigns={campaigns} />;
}
