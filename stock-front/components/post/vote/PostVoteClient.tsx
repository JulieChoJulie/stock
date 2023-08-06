"use client"

import { FC, useEffect, useState } from "react"
import { VoteType } from "@prisma/client"
import axios, { AxiosError } from "axios"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { PostVoteRequest } from "@/lib/validators/vote"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { homepageUrl } from "@/lib"

interface PostVoteClientProps {
  postId: string
  initialVotesAmt: number
  initialVote: VoteType | null
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  initialVotesAmt,
  initialVote,
}) => {
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const [prevVote, setPrevVote] = useState<VoteType | null>(null)

  const pathname = usePathname()
  // toast with login link including callbackUrl of pathname
  const { loginToast } = useCustomToast(`${homepageUrl}${pathname}`)

  // sync with server comp
  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        voteType: type,
        postId,
      }
      await axios.patch("/api/post/vote", payload)
    },
    onMutate: (type: VoteType) => {
      // only count 'UP' for vote amount
      if (currentVote === type) {
        // remove their vote
        setCurrentVote(null)

        if (type === "UP") setVotesAmt((prev) => prev - 1)
      } else {
        if (type === "UP") setVotesAmt((prev) => prev + 1)
        if (type === "DOWN" && currentVote === "UP") {
          setVotesAmt((prev) => prev - 1)
        }
        setCurrentVote(type)
      }
      setPrevVote(currentVote)
    },
    onError: (err, voteType) => {
      // restore vote count
      if (prevVote === voteType) {
        // fail to remove their vote
        if (voteType === "UP") setVotesAmt((prev) => prev + 1)
      } else {
        if (voteType === "UP") setVotesAmt((prev) => prev - 1)
        if (voteType === "DOWN" && prevVote === "UP")
          setVotesAmt((prev) => prev + 1)
      }

      setCurrentVote(prevVote)
      setPrevVote(null)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      })
    },
  })

  return (
    <div>
      {/* upvote */}
      <Button
        isLoading={false}
        onClick={() => vote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <ThumbsUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
        <p className="font-sm text-zinc-900">
          {votesAmt === 0 ? null : votesAmt}
        </p>
      </Button>

      {/* upvote */}
      <Button
        isLoading={false}
        onClick={() => vote("DOWN")}
        size="sm"
        variant="ghost"
        aria-label="downvote"
      >
        <ThumbsDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  )
}

export default PostVoteClient
