import CloseModal from "@/components/CloseModal"
import SignupCard from "@/components/auth/SignupCard"
import { FC } from "react"

const page = () => {
  return (
    <div className="fixed inset-0 bg-slate-400 z-10">
      <div className="container flex items-center h-full max-w-lg mx-auto">
        <div className="relative bg-white w-full h-fit py-20 px-2 rounded-lg">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>
          <SignupCard />
        </div>
      </div>
    </div>
  )
}

export default page