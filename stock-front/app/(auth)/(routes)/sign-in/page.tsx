import GoBackButton from "@/components/GoBackButton"
import LoginCard from "@/components/auth/LoginCard"

export default function Home() {
  return (
    <>
      <div className="w-full ml-8">
        <GoBackButton />
      </div>
      <LoginCard />
    </>
  )
}
