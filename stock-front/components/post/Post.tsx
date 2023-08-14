"use client"

import { Post, User, Vote } from "@prisma/client"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { FC } from "react"
import { formatTimeToNow } from "@/lib/utils"
import PostVoteClient from "./vote/PostVoteClient"
import PostPreview from "./PostPreview"

type PartialVote = Pick<Vote, "type">

interface PostProps {
  post: Post & {
    author: User
    votes: Vote[]
  }
  votesAmt: number
  communityName: string
  currentVote?: PartialVote
  commentAmt: number
}

const Post: FC<PostProps> = ({
  post,
  votesAmt: _votesAmt,
  communityName,
  commentAmt,
  currentVote: _currentVote,
}) => {
  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <div className="w-0 flex-1">
          <div className="max-h-30 mt-1 text-xs text-gray-500">
            {communityName ? (
              <>
                <a
                  className="
                  hover:font-semibold
                  underline text-zinc-900 text-sm underline-offset-2"
                  href={`/c/${communityName}`}
                >
                  c/{communityName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by @{post.author.username}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/c/${communityName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
            <PostPreview content={post.content} />
          </a>
        </div>
      </div>

      <div className="flex justify-between bg-gray-50 z-20 text-sm px-4 py-2 sm:px-6">
        <PostVoteClient
          initialVote={_currentVote?.type}
          postId={post.id}
          initialVotesAmt={_votesAmt}
        />
        <Link
          href={`/c/${communityName}/post/${post.id}`}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </Link>
      </div>
    </div>
  )
}
export default Post
