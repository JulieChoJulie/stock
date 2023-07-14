import { getServerSession } from "next-auth/next";
import { options } from "@/app/options";

import SignupCard from "@/components/Auth/SignupCard";

export default async function Home() {
  const session = await getServerSession(options);
  console.log(session);
  //   return (
  //     <>
  //       {
  //         session ? <Card user={session.user?.name} />:<SignupForm/>
  //       }
  //     </>
  //   );
  return <SignupCard />;
}
