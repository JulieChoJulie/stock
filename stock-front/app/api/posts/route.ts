import { db } from "@/lib/db"
import { z } from "zod"
import { NextResponse, NextRequest } from "next/server"
import { getAuthSession } from "@/app/options"
import axios from "axios"
import { getNewUrl } from "../image/route"

// export async function GET(req: Request) {
//   const url = new URL(req.url)

//   const session = await getAuthSession()

//   //   let followedCommunitiesIds: string[] = []

//   //   if (session) {
//   //     const followedCommunities = await db.subscription.findMany({
//   //       where: {
//   //         userId: session.user.id,
//   //       },
//   //       include: {
//   //         community: true,
//   //       },
//   //     })

//   //     followedCommunitiesIds = followedCommunities.map((sub) => sub.community.id)
//   //   }

//   try {
//     const { limit, page, communityName } = z
//       .object({
//         limit: z.string(),
//         page: z.string(),
//         communityName: z.string().nullish().optional(),
//       })
//       .parse({
//         communityName: url.searchParams.get("communityName"),
//         limit: url.searchParams.get("limit"),
//         page: url.searchParams.get("page"),
//       })

//     console.log("limit: ", limit)
//     console.log("page: ", page)
//     console.log("communityName: ", communityName)

//     const whereClause = {
//       community: {
//         name: communityName,
//       },
//     }

//     // let whereClause = {}

//     // if (communityName) {
//     //   whereClause = {
//     //     community: {
//     //       name: communityName,
//     //     },
//     //   }
//     // } else if (session) {
//     //   whereClause = {
//     //     community: {
//     //       id: {
//     //         in: followedCommunitiesIds,
//     //       },
//     //     },
//     //   }
//     // }

//     const posts = await db.post.findMany({
//       take: parseInt(limit),
//       skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         community: true,
//         votes: true,
//         author: true,
//         comments: true,
//       },
//       where: {
//         community: {
//           name: communityName as string,
//         },
//       },
//     })

//     if (!posts) {
//       return NextResponse.json("No more posts", { status: 422 })
//     }

//     return NextResponse.json(posts)
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Could not fetch posts." },
//       { status: 500 },
//     )
//   }
// }

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
            console.log("src: ", src)
          }
          return block
        }),
      )
      return post
    }),
  )
}

export async function GET(req: NextRequest) {
  const communityName =
    (req.nextUrl.searchParams.get("communityName") as string) ?? ""
  const limitParam: string | null = req.nextUrl.searchParams.get("limit")

  let limit: number
  if (limitParam) {
    // not null
    limit = parseInt(limitParam, 10) as number
  } else {
    limit = 2
  }

  const posts = await db.post.findMany({
    take: limit,
    where: {
      community: {
        name: communityName,
      },
    },
    include: {
      community: true,
      votes: true,
      author: true,
      comments: true,
    },
  })

  const postsWithUrl = await getPostsWithNewUrl(posts)

  return new Response(JSON.stringify(postsWithUrl))
}
