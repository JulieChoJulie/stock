import { getAuthSession } from "@/app/options"
import CreatePost from "@/components/post/CreatePost"
import PostFeed from "@/components/post/PostFeed"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: PageProps) => {
  const { slug } = params
  const session = await getAuthSession()
  const community = await db.community.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
        take: 100,
      },
    },
  })

  if (!community) return notFound()
  return (
    <>
      <h1 className="hidden md:block font-bold text-xl md:text-2xl h-14">
        c/{community.name}
      </h1>
      <CreatePost session={session} />
      {/* Show posts */}
      <PostFeed initialPosts={community.posts} communityName={community.name} />
    </>
  )
}

export default page
