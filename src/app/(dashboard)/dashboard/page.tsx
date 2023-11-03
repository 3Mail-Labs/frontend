import { redirect } from "next/navigation";

import { CreateCampaignButton } from "@/components/campaigns/create-campaign-button";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <CreateCampaignButton />
      </div>
    </div>
  );
}
