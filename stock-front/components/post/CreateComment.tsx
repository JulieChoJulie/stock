"use client"

import { FC, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { commentRequest } from "@/lib/validators/comment"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast"
import { Button } from "../ui/button"

interface CreateCommentProps {
  postId: string
  replyToId: string | null
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [input, setInput] = useState<string>("")
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: commentRequest) => {
      const payload: commentRequest = {
        postId,
        text,
        replyToId,
      }

      const { data } = await axios.patch(`/api/comment`, payload)
      return data
    },
    onSuccess: () => {
      // re-fetch data for server components only.
      // client component and browser state stay the same.
      router.refresh()
      setInput("")
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }

        if (
          typeof err.response?.data === "string" &&
          err.response?.data.startsWith("<!DOCTYPE html>")
        ) {
          return toast({
            description: err.message,
            variant: "destructive",
          })
        }

        return toast({
          description: err.response?.data,
          variant: "destructive",
        })
      }

      return toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    },
  })
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your Comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="Add a comment..."
        />
        <div className="mt-2 flex justify-end">
          <Button
            onClick={() =>
              postComment({
                postId,
                replyToId,
                text: input,
              })
            }
            isLoading={isLoading}
            disabled={input.length === 0}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment
