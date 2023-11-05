import { redirect } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
// import { CreateListButton } from "@/components/lists/create-list-button";
import { Card, CardContent } from "@/components/ui/card";
import { env } from "@/env.mjs";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Embded",
};

export default async function EmbedPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const embedCode = `<iframe src="${env.NEXT_PUBLIC_EMBED_URL}/${user.address}/subscribe"></iframe>`;

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h1 className="text-3xl font-bold">Embed</h1>
        {/* <CreateListButton /> */}
      </div>
      <Card>
        <CardContent className="relative p-4">
          <div className="w-[90%] font-mono">{embedCode}</div>
          <CopyButton className="absolute right-4 top-4 cursor-pointer" text={embedCode} />
        </CardContent>
      </Card>
      <iframe
        src={`${env.NEXT_PUBLIC_EMBED_URL}/${user.address}/subscribe`}
        className="mt-8 h-[500px] w-full rounded-lg"
      />
    </div>
  );
}
