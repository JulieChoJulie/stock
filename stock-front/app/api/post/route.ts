import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { PostValidator } from "@/lib/validators/post"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Please log in first.", { status: 401 })
    }

    const body = await req.json()
    const { communityId, title, content } = PostValidator.parse(body)
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    })

    if (!subscriptionExists) {
      return new Response("Please subscribe the community first.", {
        status: 400,
      })
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        communityId,
      },
    })

    return NextResponse.json({ status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }
    return new Response(
      "Could not post to the community. Please try again later.",
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const postId: string = req.nextUrl.searchParams.get("postId")
    const post = await db.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        votes: true,
      },
    })

    if (!post) return new Response(null, { status: 404 })
    return new Response(JSON.stringify(post))
  } catch (err) {
    return new Response(
      "Could not fetch the post at this time. Please try again later.",
      {
        status: 500,
      },
    )
  }
}
