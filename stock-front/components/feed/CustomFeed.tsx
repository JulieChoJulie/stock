import axios from "axios"
import { getAuthSession } from "@/app/options"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { ExtendedPost } from "@/types/db"
import { homepageUrl } from "@/lib"
import { PostsError } from "@/lib/exceptions/postsError"
import PostFeed from "./PostFeed"

const CustomFeed = async () => {
  // const session = await getAuthSession()

  const query: string = `${homepageUrl}/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=1&communityName`
  const res = await axios.get(query)
  const posts: ExtendedPost[] | null = res.data ?? null

  if (!posts) throw new PostsError()

  return <PostFeed initialPosts={posts} />
}

export default CustomFeed
