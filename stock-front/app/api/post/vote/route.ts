import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { PostVoteValidator } from "@/lib/validators/vote"
import { CachedPost } from "@/types/redis"
import { User } from "lucide-react"
import { z } from "zod"

// threshold for high engagement to cache the votes
const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { postId, voteType } = PostVoteValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Please log in first.", { status: 401 })
    }

    const voteExists = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    })

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    })

    if (!post) {
      return new Response("Post not found", { status: 404 })
    }

    if (voteExists) {
      if (voteExists.type === voteType) {
        // remove the vote
        await db.vote.delete({
          where: {
            userId_postId: {
              userId: session.user.id,
              postId,
            },
          },
        })
        return new Response("OK")
      }
      // update the existing vote with the current vote
      await db.vote.update({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId,
          },
        },
        data: {
          type: voteType,
        },
      })

      // recount the votes
      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1
        return acc
      }, 0)

      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          autherUsername: post.author.username ?? "",
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          currentVote: voteType,
          createdAt: post.createdAt,
        }

        await redis.hset(`post:${postId}`, cachePayload)
      }

      return new Response("OK")
    }

    // when no existing vote
    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    })

    // recount the votes
    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1
      return acc
    }, 0)

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        autherUsername: post.author.username ?? "",
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        currentVote: voteType,
        createdAt: post.createdAt,
      }

      await redis.hset(`post:${postId}`, cachePayload)
    }

    return new Response("OK")
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid POST request data passed for vote", {
        status: 422,
      })
    }
    return new Response("Could not register your vote. Please try again.", {
      status: 500,
    })
  }
}
