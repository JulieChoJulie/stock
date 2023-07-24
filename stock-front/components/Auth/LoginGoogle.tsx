"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "../ui/button"
import { Icons } from "../Icons"

const LoginGoogle = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const loginWithGoogle = async () => {
    setIsLoading(true)

    try {
      await signIn("google")
    } catch (error) {
      // toast notification
      toast({
        title: "Google Login Error",
        description: "There was a error logging in with Google.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Button
      type="button"
      onClick={loginWithGoogle}
      isLoading={isLoading}
      className="bg-white border py-1 w-full rounded-xl mt-2 flex justify-center items-center text-base 
      hover:scale-103 hover:bg-slate-200 duration-300 text-[#002D74]"
    >
      {isLoading ? null : <Icons.GOOGLE />}
      Login with Google
    </Button>
  )
}

export default LoginGoogle
