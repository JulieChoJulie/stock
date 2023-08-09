import { z } from "zod"
import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { CommentVoteValidator } from "@/lib/validators/vote"

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { commentId, voteType } = CommentVoteValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Please log in first.", { status: 401 })
    }

    const voteExists = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    })

    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        author: true,
        votes: true,
      },
    })

    if (!comment) {
      return new Response("Comment not found", { status: 404 })
    }

    if (voteExists) {
      if (voteExists.type === voteType) {
        // remove the vote
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
        })
      } else {
        // update the existing vote with the current vote
        await db.commentVote.update({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
          data: {
            type: voteType,
          },
        })
      }
      return new Response("OK")
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      },
    })

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
