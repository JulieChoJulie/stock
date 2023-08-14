"use client"

import { FC, useRef, useState } from "react"
import { Comment, CommentVote, User } from "@prisma/client"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { formatTimeToNow } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import UserAvatar from "../../UserAvatar"
import CommentVotes from "./CommentVotes"
import CreateComment from "./CreateComment"

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
}

interface PostCommentProps {
  comment: ExtendedComment
  currentVote: CommentVote | undefined
  votesAmt: number
  postId: string
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  currentVote,
  votesAmt,
  postId,
}) => {
  const commentRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const router = useRouter()
  const pathname: string = usePathname()
  const [isReplying, setIsReplying] = useState<boolean>(false)

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          className="h-6 w-6"
          user={{
            name: comment.author.name || comment.author.username || null,
            image: comment.author.image || null,
          }}
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-semibold text-gray-900">
            @{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2 ml-4">{comment.text}</p>
      <div className="flex gap-2 items-center">
        <CommentVotes
          commentId={comment.id}
          initialVote={currentVote}
          initialVotesAmt={votesAmt}
          postId={postId}
        />
        <Button
          onClick={() => {
            if (!session) return router.push(`/sign-in?callbackUrl=${pathname}`)
            setIsReplying(true)
          }}
          isLoading={false}
          variant="ghost"
          size="sm"
          aria-label="reply"
        >
          Reply
        </Button>
      </div>
      {isReplying ? (
        <div className="p-4">
          <CreateComment
            postId={postId}
            replyToId={comment.replyToId ?? comment.id}
            setIsReplying={setIsReplying}
          />
        </div>
      ) : null}
    </div>
  )
}

export default PostComment
