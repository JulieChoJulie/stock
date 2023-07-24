import { getServerSession } from "next-auth/next"
import SignupCard from "@/components/auth/SignupCard"

export default function Home() {
  return <SignupCard />
}
