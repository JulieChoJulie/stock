import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { z } from "zod"
import { CommunityValidator } from "@/lib/validators/community"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Login Required", {
        status: 401,
        statusText: "Login Required",
      })
    }

    const body = await req.json()
    const { name } = CommunityValidator.parse(body)

    const communityExists = await db.community.findFirst({
      where: { name },
    })

    if (communityExists) {
      const message: string = `Community "${name}" already exists`
      return new Response(null, { status: 409, statusText: message })
    }

    const community = await db.community.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    })

    await db.subscription.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
      },
    })

    return new Response(community.name)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message: string =
        "Please choose a name between 3 and 20 characters."
      return new Response(null, { status: 422, statusText: message })
    }
    const message: string = "Could not create a community. Try again later."
    return new Response(null, {
      status: 500,
      statusText: message,
    })
  }
}
