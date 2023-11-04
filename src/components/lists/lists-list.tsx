import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

import { NoListsPlaceholder } from "./no-list-placeholder";

const getLists = cache(async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const lists = await prisma.list.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return lists;
});

export async function ListsList() {
  const lists = await getLists();

  if (!lists || lists.length === 0) {
    return <NoListsPlaceholder />;
  }

  return <div>Lists</div>;
}
