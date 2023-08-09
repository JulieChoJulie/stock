import { z } from "zod"
import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { commentValidator } from "@/lib/validators/comment"

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { postId, text, replyToId } = commentValidator.parse(body)
    const session = await getAuthSession()

    if (!session) {
      return new Response("Sign in is required to post a comment.", {
        status: 401,
      })
    }

    await db.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    })

    return new Response("OK")
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message as string, { status: 422 })
    }

    return new Response(
      "Could not post a comment at this moment. Please try again later.",
      {
        status: 500,
      },
    )
  }
}
