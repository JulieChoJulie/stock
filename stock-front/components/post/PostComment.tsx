"use client"

import { FC, useRef } from "react"
import { Comment, CommentVote, User } from "@prisma/client"
import { formatTimeToNow } from "@/lib/utils"
import UserAvatar from "../UserAvatar"

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
}

interface PostCommentProps {
  comment: ExtendedComment
}

const PostComment: FC<PostCommentProps> = ({ comment }) => {
  const commentRef = useRef<HTMLDivElement>(null)
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
          <p className="text-sm font-medium text-gray-900">
            @{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2 ml-4">{comment.text}</p>
    </div>
  )
}

export default PostComment
