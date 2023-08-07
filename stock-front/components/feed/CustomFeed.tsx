import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import PostFeed from "./PostFeed"

const CustomFeed = async () => {
  const session = await getAuthSession()
  const userSubscriptions = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      community: true,
    },
  })

  const posts = await db.post.findMany({
    where: {
      community: {
        id: {
          in: userSubscriptions.map(({ community }) => community.id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      community: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  })

  return <PostFeed initialPosts={posts} />
}

export default CustomFeed
