import { z } from "zod"
import { NextRequest } from "next/server"
import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { getNewUrl } from "../image/route"

export const getPostsWithNewUrl = async (posts) => {
  return await Promise.all(
    posts.map(async (post) => {
      await Promise.all(
        post.content?.blocks.map(async (block) => {
          if ("file" in block.data && "url" in block.data.file) {
            const { url } = block.data.file
            const key = url.split("?")[0].split(`amazonaws.com/`)[1]
            const src = await getNewUrl(key)
            block.data.file.url = src
          }
          return block
        }),
      )
      return post
    }),
  )
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl

  const session = await getAuthSession()

  // if parameter communityName="" (empty str)
  // then get all posts for the subscribed community
  let subscribedCommunityIds: string[] = []

  if (session) {
    const subscriptions = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        community: true,
      },
    })

    subscribedCommunityIds = subscriptions.map(({ community }) => community.id)
  }

  try {
    const { limit, page, communityName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        comunityName: z.string().nullish().optional(),
      })
      .parse({
        communityName: url.searchParams.get("communityName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      })

    let whereClause = {}

    if (communityName) {
      whereClause = {
        community: {
          name: communityName,
        },
      }
    } else if (session) {
      whereClause = {
        community: {
          id: {
            in: subscribedCommunityIds,
          },
        },
      }
    }

    const posts = await db.post.findMany({
      take: parseInt(limit, 10),
      skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        community: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    })

    // update signed url from s3 for images
    const postsWithUrl = await getPostsWithNewUrl(posts)

    return new Response(JSON.stringify(postsWithUrl))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response(
      "Could not fetch posts at this time. Please try again later.",
      {
        status: 500,
      },
    )
  }
}
