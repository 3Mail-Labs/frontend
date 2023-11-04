import { redirect } from "next/navigation";
import { Suspense } from "react";

import { CampaignsList } from "@/components/campaigns/campaigns-list";
import { CreateCampaignButton } from "@/components/campaigns/create-campaign-button";
import { Icons } from "@/components/icons";
import { getLists } from "@/components/lists/lists-list";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const lists = await getLists();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        {lists && <CreateCampaignButton lists={lists} />}
      </div>
      <div className="mt-6">
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Icons.spinner className="h-5 w-5 animate-spin" />
            </div>
          }
        >
          <CampaignsList />
        </Suspense>
      </div>
    </div>
  );
}
