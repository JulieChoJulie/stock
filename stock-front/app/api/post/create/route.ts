import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { PostValidator } from "@/lib/validators/post"
import { NextResponse } from "next/server"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const { communityId, title, content } = PostValidator.parse(body.payload)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    })

    if (!subscriptionExists) {
      return NextResponse.json(
        { error: "Please subscribe the community first." },
        { status: 400 },
      )
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        communityId,
      },
    })

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { message: "Could not post to the community. Please try again later." },
      { status: 500 },
    )
  }
}
