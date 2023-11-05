import { cache } from "react";

import { NoContactsPlaceholder } from "@/components/contacts/no-contacts-placeholder";
import { env } from "@/env.mjs";

import { NotificationContactsTable } from "./notification-contacts-table";

export const getNotificationContacts = cache(async () => {
  const res = await fetch(`${env.NEXTAUTH_URL}/api/subscribers`);
  const json = await res.json();

  const contacts = json.subscribers.map((subscriber: string) => ({
    address: subscriber.replace("eip155:1:", ""),
  }));

  return contacts;
});

export async function NotificationContactsList() {
  const contacts = await getNotificationContacts();

  console.log("Contacts: ", contacts);

  if (!contacts || contacts.length === 0) {
    return <NoContactsPlaceholder />;
  }

  return <NotificationContactsTable contacts={contacts} />;
}
