import { options } from "@/app/options";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import SignupForm from "@/components/SignupForm";

import { getServerSession } from "next-auth/next"
import SignupCard from "@/components/Auth/SignupCard";


export default async function Home() {
  const session = await getServerSession(options)
  console.log(session)
//   return (
//     <>
//       {
//         session ? <Card user={session.user?.name} />:<SignupForm/>
//       }
//     </>
//   );
    return( 
        <SignupCard />
    )
}