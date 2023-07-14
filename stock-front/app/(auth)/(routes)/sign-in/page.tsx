import { options } from "@/app/options";
import Card from "@/components/tempCard";

import { getServerSession } from "next-auth/next"
import LoginCard from "@/components/Auth/LoginCard";


export default async function Home() {
  const session = await getServerSession(options)
  console.log(session)
  return (
    <>
      {
        session ? <Card user={session.user?.name} />:<LoginCard/>
      }
    </>
  );
}