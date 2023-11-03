import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();

  return <>{user ? <div>{user.address}</div> : <div>Not signed in</div>}</>;
}
