"use client"

import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"

const error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-100px)] pb-[10rem]">
      <div className="flex flex-col text-center items-center space-y-5">
        <AlertTriangle size={48} color="#f25454" />
        <p
          className="text-base font-semibold text-emerald-600
        
        "
        >
          {error.message || "Something went wrong."}
        </p>

        <div className="space-x-2">
          <Button isLoading={false} onClick={reset}>
            Try again
          </Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default error
