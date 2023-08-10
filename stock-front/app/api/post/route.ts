import { promises } from "dns"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { PostValidator } from "@/lib/validators/post"

async function createConnectionWithPost(hashtag: string, postId: string) {
  const existingHashtag = await db.hashtag.findUnique({
    where: {
      name: hashtag,
    },
  })

  if (existingHashtag) {
    // Hashtag already exists, connect it to the post
    await db.hashtag.update({
      where: {
        name: hashtag,
      },
      data: {
        posts: {
          create: [
            {
              post: {
                connect: {
                  id: postId,
                },
              },
            },
          ],
        },
      },
    })
  } else {
    // Hashtag doesn't exist, create it and connect to the post
    await db.hashtag.create({
      data: {
        name: hashtag,
        posts: {
          create: [
            {
              post: {
                connect: {
                  id: postId,
                },
              },
            },
          ],
        },
      },
    })
  }
}

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

    const post = await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        communityId,
      },
    })

    // find hashtags and connect with published post
    content.blocks.forEach(async (obj) => {
      if (obj.type === "paragraph") {
        // find hashtags in paragraph
        const hashtags: string[] = obj.data.text.match(/(#[^\s#]+)/)

        await Promise.all(
          hashtags.map(async (_tag) => {
            // remove # eg. "#hashtag" -> "hashtag"
            const tag = _tag.slice(1)
            createConnectionWithPost(tag, post.id)
          }),
        )
      }
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
    const postId = req.nextUrl.searchParams.get("postId")
    const post = await db.post.findFirst({
      where: {
        id: postId ?? "",
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
