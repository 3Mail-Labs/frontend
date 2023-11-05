import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ContactsList } from "@/components/contacts/contacts-list";
// import { CreateContactButton } from "@/components/contacts/create-contact-button";
import { NotificationContactsList } from "@/components/contacts/notification-contacts-list";
import { Icons } from "@/components/icons";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Contacts",
};

export default async function ContactsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Contacts</h1>
        {/* <CreateContactButton /> */}
      </div>
      <div className="mt-6">
        <h3 className="mb-1 text-lg font-bold">Email Contacts</h3>
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Icons.spinner className="h-5 w-5 animate-spin" />
            </div>
          }
        >
          <ContactsList />
        </Suspense>
        <div className="mt-6">
          <h3 className="mb-1 text-lg font-bold">Notification Contacts</h3>
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Icons.spinner className="h-5 w-5 animate-spin" />
              </div>
            }
          >
            <NotificationContactsList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
