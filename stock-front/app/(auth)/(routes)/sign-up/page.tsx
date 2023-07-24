import GoBackButton from "@/components/GoBackButton"
import SignupCard from "@/components/auth/SignupCard"

export default function Home() {
  return (
    <>
      <div className="w-full ml-8">
        <GoBackButton />
      </div>
      <SignupCard />
    </>
  )
}
