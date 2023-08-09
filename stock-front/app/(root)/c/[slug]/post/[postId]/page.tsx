import { Post, Vote, User } from "@prisma/client"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Loader2, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"
import axios from "axios"
import { BsTruckFlatbed } from "react-icons/bs"
import { redis } from "@/lib/redis"
import { CachedPost } from "@/types/redis"
import { db } from "@/lib/db"
import { buttonVariants } from "@/components/ui/button"
import PostVoteServer from "@/components/post/vote/PostVoteServer"
import { formatTimeToNow } from "@/lib/utils"
import EditorOutput from "@/components/post/EditorOutput"
import { PostwithComments } from "@/types/db"
import { homepageUrl } from "@/lib"
import { getPostsWithNewUrl } from "@/app/api/posts/route"
import CommentSection from "@/components/post/comment/CommentSection"

interface PageProps {
  params: {
    postId: string
  }
}

function PostVoteShell({ votesAmt }: { votesAmt: number | undefined }) {
  return (
    <div>
      {/* upvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ThumbsUp className="h-5 w-5 text-zinc-700" />
        <p className="font-sm text-zinc-900">
          {votesAmt !== undefined ? (
            votesAmt
          ) : (
            <Loader2 className="h-3 w-3 animate-spin" />
          )}
        </p>
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ThumbsDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  )
}

// hard reload for fresh comments and etc
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

const page = async ({ params }: PageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`,
  )) as CachedPost

  let post: (Post & { votes: Vote[]; author: User }) | null = null
  let postWithUrl:
    | (Post & { votes: Vote[]; author: User })
    | CachedPost
    | null = cachedPost

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    })

    postWithUrl = post
  }

  if (!post && !cachedPost) {
    return notFound()
  }

  // update signed image url from s3
  const [_postWithUrl] = await getPostsWithNewUrl([postWithUrl])
  postWithUrl = _postWithUrl

  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <div className="w-0 flex-1">
          <div className="max-h-30 mt-1 text-xs text-gray-500">
            <span>
              Posted by @{post?.author.username ?? cachedPost.authorUsername}
            </span>{" "}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </div>
          <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
            {post?.title ?? cachedPost.title}
          </h1>
          <EditorOutput content={postWithUrl?.content} />
        </div>
      </div>

      <div className="flex justify-between items-center bg-gray-50 z-20 text-sm px-4 py-2 sm:px-6">
        <Suspense
          fallback={
            <PostVoteShell
              votesAmt={cachedPost ? cachedPost.votesAmt : undefined}
            />
          }
        >
          {/* ts expect error for server component */}
          <PostVoteServer
            postId={params.postId}
            getData={async () => {
              // if post retrieved from db
              if (!cachedPost) return post

              // if post is from cachedPost
              const { data } = await axios.get(
                `${homepageUrl}/api/post?postId=${params.postId}`,
              )
              return data as PostwithComments
            }}
          />
        </Suspense>
      </div>

      <Suspense
        fallback={<Loader2 className="h-5 w-5 animate-spin text-zinc-500" />}
      >
        {/* ts expect error server component */}
        <CommentSection postId={post?.id ?? ""} />
      </Suspense>

      {/* <Link
          href={`/c/${communityName}/post/${post.id}`}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </Link> */}
    </div>
  )
}

export default page
