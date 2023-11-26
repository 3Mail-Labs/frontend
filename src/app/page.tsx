import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();

  console.log("User: ", user);

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex justify-center py-20">
      <p>Sign in to access your dashboard</p>
    </div>
  );
}
