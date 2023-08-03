"use client"

import { ExtendedPost } from "@/types/db"
import { FC, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Post from "./Post"

interface PostFeedProps {
  initialPosts: ExtendedPost[]
  communityName: string
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, communityName }) => {
  const [page, setPage] = useState(0)
  const data = []
  const posts: ExtendedPost[] = data?.results ?? initialPosts
  const { data: session } = useSession()

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1
          if (vote.type === "DOWN") return acc - 1
          return acc
        }, 0)

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id,
        )

        return (
          <li className="h-[50rem] py-30 bg-slate-300" key={post.id}>
            <div className="py-[10rem]">{post.title}</div>
          </li>
        )

        // return (
        //   <Post
        //     key={post.id}
        //     post={post}
        //     commentAmt={post.comments.length}
        //     subredditName={post.subreddit.name}
        //     votesAmt={votesAmt}
        //     currentVote={currentVote}
        //   />
        // )
      })}
    </ul>
  )
}

export default PostFeed
