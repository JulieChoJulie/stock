"use client"

import { FC } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

const CloseModal = () => {
  const router = useRouter()
  return (
    <Button
      isLoading={false}
      variant="subtle"
      className="w-6 h-6 rounded-md text-xl"
      aria-label="close modal"
      onClick={() => router.back()}
    >
      X
    </Button>
  )
}

export default CloseModal
