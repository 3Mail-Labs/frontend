import { cache } from "react";

import { NoContactsPlaceholder } from "@/components/contacts/no-contacts-placeholder";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

import { ContactsTable } from "./contacts-table";

const getContacts = cache(async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }

  // sleep
  // const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  // await sleep(1000);

  const projects = await prisma.contact.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return projects;
});

export async function ContactsList() {
  const contacts = await getContacts();

  if (!contacts || contacts.length === 0) {
    return <NoContactsPlaceholder />;
  }

  return <ContactsTable contacts={contacts} />;
}
