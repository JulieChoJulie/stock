"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FC } from "react"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { UsernameRequest, UsernameValidator } from "@/lib/validators/profile"
import { handleMuataionError } from "@/lib/exceptions/mutationError"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"

interface UsernameFormProps {
  user: Pick<User, "id" | "username">
}

const UsernameForm: FC<UsernameFormProps> = ({ user }) => {
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      username: user?.username || "",
    },
  })

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ username }: UsernameRequest) => {
      const payload: UsernameRequest = { username }
      if (username === user?.username) {
        return toast({
          title: "Username unchanged.",
          description: " No changes were made",
        })
      }
      const { data } = await axios.patch(`/api/profile/username`, payload)
      return data
    },
    onSuccess: () => {
      toast({
        description: "You successfully changed your username.",
      })
      router.refresh()
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Username already taken.",
            description: "Please choose a different username.",
            variant: "destructive",
          })
        }
      }
      return handleMuataionError(err, loginToast)
    },
  })

  return (
    <form
      onSubmit={handleSubmit((e) => {
        if (e.username === user?.username) {
          return toast({
            title: "Username unchanged.",
            description: " No changes were made.",
          })
        }
        updateUsername(e)
      })}
    >
      <CardHeader>
        <CardTitle className="mb-2">Your username</CardTitle>
        <CardDescription>Please enter a display username.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-row justify-between">
        <div className="flex flex-col">
          <div className="relative grid gap-y-1">
            <div className="absolute bottom-[-5px] left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-zinc-400">@</span>
            </div>
            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              className="w-[400px] pl-6"
              size={32}
              {...register("username")}
            />
            {/* {errors?.username && (
              <p className="px-1 text-xs text-red-500">
                {errors.username.message}
              </p>
            )} */}
          </div>
          {errors?.username && (
            <p className="px-1 mt-2 text-xs text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>
        <Button size="sm" isLoading={isLoading}>
          Save Change
        </Button>
      </CardContent>

      {/* <CardFooter className="justify-end">
        <Button size="sm" isLoading={isLoading} className="text-sm">
          Save Change
        </Button>
      </CardFooter> */}
    </form>
  )
}

export default UsernameForm
