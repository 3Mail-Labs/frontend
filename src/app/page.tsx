import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      {user ? (
        <div className="flex justify-center py-8">
          <Link href={"/dashboard"}>
            <Button>Go to dashboard</Button>
          </Link>
        </div>
      ) : (
        <div className="flex justify-center py-8">Not signed in!</div>
      )}
    </>
  );
}
