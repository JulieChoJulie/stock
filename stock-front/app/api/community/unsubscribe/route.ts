import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { CommunitySubscriptionValidator } from "@/lib/validators/community"
import { NextResponse } from "next/server"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return NextResponse.json(
        { message: "Please login first." },
        { status: 401 },
      )
    }

    const body = await req.json()

    const { communityId } = CommunitySubscriptionValidator.parse(body)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    })

    if (!subscriptionExists) {
      return NextResponse.json(
        { message: "You are not subscribed to this community." },
        { status: 400 },
      )
    }

    // check if user is the owner of this community
    const community = await db.community.findFirst({
      where: {
        id: communityId,
        creatorId: session.user.id,
      },
    })

    if (community) {
      return NextResponse.json(
        { message: "You cannot unsubscribed from your own community." },
        { status: 400 },
      )
    }

    await db.subscription.delete({
      where: {
        userId_communityId: { communityId, userId: session.user.id },
      },
    })

    return new Response()
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.message }, { status: 422 })
    }
    return NextResponse.json(
      { message: "Could not unsubscribe. Please try again later." },
      { status: 500 },
    )
  }
}
