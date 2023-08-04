import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { z } from "zod"
import { CommunityValidator } from "@/lib/validators/community"
import { NextRequest, NextResponse } from "next/server"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { getPostsWithNewUrl } from "../posts/route"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Please login first.", { status: 401 })
    }

    const body = await req.json()
    const { name } = CommunityValidator.parse(body)

    const communityExists = await db.community.findFirst({
      where: { name },
    })

    if (communityExists) {
      const message: string = `Community "${name}" already exists`
      return new Response(message, { status: 409 })
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
      return new Response(message, { status: 422 })
    }
    const message: string = "Could not create a community. Try again later."
    return new Response(message, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const name = (req.nextUrl.searchParams.get("communityName") as string) ?? ""
    const postLimitParam =
      (req.nextUrl.searchParams.get("postLimit") as string) ?? ""

    let postLimit: number
    if (postLimitParam) {
      postLimit = parseInt(postLimitParam, 10) as number
    } else {
      postLimit = INFINITE_SCROLLING_PAGINATION_RESULTS as number
    }
    const community = await db.community.findFirst({
      where: { name },
      include: {
        posts: {
          include: {
            author: true,
            votes: true,
            comments: true,
            community: true,
          },
          take: postLimit,
        },
      },
    })

    if (!community) {
      return new Response(null, { status: 404 })
    }

    // update signed image url
    const postsWithNewUrl = await getPostsWithNewUrl(community?.posts)
    community.posts = postsWithNewUrl

    return NextResponse.json({ community }, { status: 200 })
  } catch (err) {
    const message: string = "Somethign went wrong. Please try again."
    return new Response(message, { status: 500 })
  }
}
