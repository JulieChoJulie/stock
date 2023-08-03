// import { db } from "@/lib/db"
// import { z } from "zod"
// import { NextResponse } from "next/server"
// import { getAuthSession } from "@/app/options"

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
