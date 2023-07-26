"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast"
import { postComunity } from "@/slices/communitySlice"
import { AppDispatch, RootState } from "@/store/store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const Page = () => {
  const [input, setInput] = useState<string>("")
  const { loading, error, status, createdCommunity } = useSelector(
    (state: RootState) => state.community,
  )
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loginToast } = useCustomToast("%2Fc%2Fcreate")

  const createCommunity = () => dispatch(postComunity(input))

  useEffect(() => {
    if (status === 401) {
      // return loginToast()
      router.push("/sign-in?callbackUrl=%2Fc%2Fcreate")
    }
    if (status === 200) {
      toast({
        title: "Successful",
        description: `Community ${createdCommunity} is created.`,
      })
      router.push(`/c/${createdCommunity}`)
    }
    if (status === 500) {
      toast({
        title: "Internal Error",
        description: "Could not create a community",
        variant: "destructive",
      })
    }
  }, [status, loginToast, createdCommunity, router])

  return (
    <div className="container flex items-center justify-center h-full max-w-3xl mx-auto pb-16">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>
        <hr className="bg-zinc-500 h-px" />
        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400 ">
              c/
            </p>
            <Input
              className="pl-6"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>
        <div className="text-red-600">{error}</div>
        <div className="flex justify-end gap-4">
          <Button
            variant="subtle"
            isLoading={false}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            isLoading={loading}
            disabled={input.length < 3}
            onClick={() => createCommunity(input)}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page
