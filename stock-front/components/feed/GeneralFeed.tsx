import axios from "axios"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { ExtendedPost } from "@/types/db"
import { homepageUrl } from "@/lib"
import PostFeed from "./PostFeed"

const GeneralFeed = async () => {
  const query: string = `${homepageUrl}/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=1&communityName`
  const res = await axios.get(query)
  const posts: ExtendedPost[] | null = res.data ?? null

  if (!posts) return notFound()

  return <PostFeed initialPosts={posts} />
}

export default GeneralFeed
