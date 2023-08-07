"use client"

import { FC, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useIntersection } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { ExtendedPost } from "@/types/db"
import Post from "./Post"

interface PostFeedProps {
  initialPosts: ExtendedPost[]
  communityName: string
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, communityName }) => {
  const { data: session } = useSession()
  const lastPostRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(
      ["infinite-query"],
      async ({ pageParam = 1 }) => {
        const query = `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}${
          communityName ? `&communityName=${communityName}` : ""
        }`
        const { data } = await axios.get(query)
        return data as ExtendedPost[]
      },
      {
        getNextPageParam: (_, pages) => {
          const lastPage = pages[pages.length - 1]
          if (lastPage.length === 0) {
            return undefined
          }
          return pages.length + 1
        },
        initialData: { pages: [initialPosts], pageParams: [1] },
        staleTime: Infinity, // prevent re-fetching old data
      },
    )

  const posts: ExtendedPost[] =
    data?.pages.flatMap((page) => page) ?? initialPosts

  useEffect(() => {
    // load more posts when the last post comes into view
    if (!isFetchingNextPage && hasNextPage && entry?.isIntersecting) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage, isFetchingNextPage, hasNextPage])

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1
          return acc
        }, 0)

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id,
        )

        // attach ref to the last fetched post for inifite scrolling
        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                communityName={communityName ?? post.community.name}
                commentAmt={post.comments.length}
                post={post}
                votesAmt={votesAmt}
                currentVote={currentVote}
              />
            </li>
          )
        }
        return (
          <li key={post.id}>
            <Post
              commentAmt={post.comments.length}
              communityName={communityName ?? post.community.name}
              post={post}
              votesAmt={votesAmt}
              currentVote={currentVote}
            />
          </li>
        )
      })}

      {isFetchingNextPage && hasNextPage && (
        <li className="flex justify-center">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </li>
      )}
    </ul>
  )
}

export default PostFeed
