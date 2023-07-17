import { getServerSession } from "next-auth/next";
import { options } from "@/app/options";

import SignupCard from "@/components/Auth/SignupCard";

// export default async function Home() {
//   const session = await getServerSession(options);
//   return <>{session ? <div>{session.user?.name}</div> : <SignupCard />}</>;
// }

export default async function Home() {
  return <SignupCard />;
}
