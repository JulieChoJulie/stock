"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { useCreateCommunityMutation } from "@/redux/services/community/communityApi"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {
  const [input, setInput] = useState<string>("")
  const router = useRouter()
  const [createCommunity, { error, isLoading }] = useCreateCommunityMutation()

  const createdCommunity = () => {
    createCommunity(input)
      .unwrap()
      .then((payload) => {
        toast({
          title: "Successful!",
          description: `Community "${payload}" is created.`,
        })
        router.push(`/c/${payload}`)
      })
      .catch((err) => {
        const { status } = err
        if (status === 401) {
          router.push("/sign-in?callbackUrl=%2Fc%2Fcreate")
        } else if (status !== 409 && status !== 422) {
          toast({
            title: "Internal Error",
            description: "Could not create a community. Please try later.",
            variant: "destructive",
          })
        }
      })
    setInput("")
  }

  useEffect(() => {
    console.log(error)
  }, [error])

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

        {error?.data && error?.data?.message && (
          <div className="text-red-600">{error.data.message}</div>
        )}
        <div className="flex justify-end gap-4">
          <Button
            variant="subtle"
            isLoading={false}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length < 3}
            onClick={() => createdCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page
