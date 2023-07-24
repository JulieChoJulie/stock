"use client"

import { useRouter } from "next/navigation"
import { Icons } from "./Icons"

const GoBackButton = () => {
  const router = useRouter()
  return (
    <div
      role="presentation"
      className="w-6 h-6 rounded-md cursor-pointer bg-transparent
       hover:bg-slate-200"
      aria-label="close modal"
      onClick={() => router.back()}
    >
      <Icons.LEFTARROW size={25} />
    </div>
  )
}

export default GoBackButton
