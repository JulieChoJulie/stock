"use client"

import { FC, useState } from "react"
import { CommentVote, VoteType } from "@prisma/client"
import axios, { AxiosError } from "axios"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { CommentVoteRequest } from "@/lib/validators/vote"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { homepageUrl } from "@/lib"

type PartialVote = Pick<CommentVote, "type">

interface CommentVotesProps {
  commentId: string
  initialVotesAmt: number
  initialVote: PartialVote | undefined
  postId: string
}

const CommentVotes: FC<CommentVotesProps> = ({
  commentId,
  initialVotesAmt,
  initialVote,
  postId,
}) => {
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState<PartialVote | undefined>(
    initialVote,
  )
  const [prevVote, setPrevVote] = useState<PartialVote | undefined>(undefined)

  const pathname = usePathname()
  // toast with login link including callbackUrl of pathname
  const { loginToast } = useCustomToast(`${homepageUrl}${pathname}`)

  // sync with server comp
  //   useEffect(() => {
  //     setCurrentVote(initialVote)
  //   }, [initialVote])

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        voteType: type,
        commentId,
      }
      await axios.patch("/api/comment/vote", payload)
    },
    onMutate: (type) => {
      // only count 'UP' for vote amount
      if (currentVote?.type === type) {
        // remove their vote
        setCurrentVote(undefined)

        if (type === "UP") setVotesAmt((prev) => prev - 1)
      } else {
        if (type === "UP") setVotesAmt((prev) => prev + 1)
        if (type === "DOWN" && currentVote?.type === "UP") {
          setVotesAmt((prev) => prev - 1)
        }
        setCurrentVote({ type })
      }
      setPrevVote(currentVote)
    },
    onError: (err, voteType) => {
      // restore vote count
      if (prevVote?.type === voteType) {
        // fail to remove their vote
        if (voteType === "UP") setVotesAmt((prev) => prev + 1)
      } else {
        if (voteType === "UP") setVotesAmt((prev) => prev - 1)
        if (voteType === "DOWN" && prevVote?.type === "UP")
          setVotesAmt((prev) => prev + 1)
      }

      setCurrentVote(prevVote)
      setPrevVote(undefined)

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
    <div className="flex gap-1">
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
            "text-emerald-500 fill-emerald-500": currentVote?.type === "UP",
          })}
        />
        <p className="font-sm text-zinc-900">
          {votesAmt === 0 ? undefined : votesAmt}
        </p>
      </Button>

      {/* downvote */}
      <Button
        isLoading={false}
        onClick={() => vote("DOWN")}
        size="sm"
        variant="ghost"
        aria-label="downvote"
      >
        <ThumbsDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote?.type === "DOWN",
          })}
        />
      </Button>
    </div>
  )
}
export default CommentVotes
