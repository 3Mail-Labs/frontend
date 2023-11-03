import { redirect } from "next/navigation";

import { CreateContactButton } from "@/components/contacts/create-contact-button";
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
        <CreateContactButton />
      </div>
    </div>
  );
}
