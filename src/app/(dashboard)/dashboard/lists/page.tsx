import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Icons } from "@/components/icons";
import { CreateListButton } from "@/components/lists/create-list-button";
import { ListsList } from "@/components/lists/lists-list";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Lists",
};

export default async function ListsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Lists</h1>
        <CreateListButton />
      </div>
      <div className="mt-6">
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Icons.spinner className="h-5 w-5 animate-spin" />
            </div>
          }
        >
          <ListsList />
        </Suspense>
      </div>
    </div>
  );
}
