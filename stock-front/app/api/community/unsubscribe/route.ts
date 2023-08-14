import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { CommunitySubscriptionValidator } from "@/lib/validators/community"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Please login first.", { status: 401 })
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
      return new Response("You are not subscribed to this community.", {
        status: 400,
      })
    }

    // check if user is the owner of this community
    const community = await db.community.findFirst({
      where: {
        id: communityId,
        creatorId: session.user.id,
      },
    })

    if (community) {
      return new Response("You cannot unsubscribed from your own community.", {
        status: 400,
      })
    }

    await db.subscription.delete({
      where: {
        userId_communityId: { communityId, userId: session.user.id },
      },
    })

    return new Response()
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 })
    }
    return new Response("Could not unsubscribe. Please try again later.", {
      status: 500,
    })
  }
}
