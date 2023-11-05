import { redirect } from "next/navigation";
import { Suspense } from "react";

import { CampaignsList } from "@/components/campaigns/campaigns-list";
import { CreateCampaignButton } from "@/components/campaigns/create-campaign-button";
import { CreateNotificationCampaignButton } from "@/components/campaigns/create-notification-campaign-button";
import { getContacts } from "@/components/contacts/contacts-list";
import { getNotificationContacts } from "@/components/contacts/notification-contacts-list";
import { Icons } from "@/components/icons";
import { getLists } from "@/components/lists/lists-list";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const [user, lists, contacts, notificationContacts] = await Promise.all([
    getCurrentUser(),
    getLists(),
    getContacts(),
    getNotificationContacts(),
  ]);

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <div className="flex gap-2">
          {lists && (
            <CreateNotificationCampaignButton
              contacts={notificationContacts.map((c: any) => c.address)}
              lists={lists}
            />
          )}
          {lists && contacts && <CreateCampaignButton lists={lists} contacts={contacts} />}
        </div>
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
