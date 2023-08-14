import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const hashtag = url.searchParams.get("hashtag")

    if (!hashtag) {
      return new Response("Hashtag query param missing", { status: 400 })
    }

    const posts = await db.hashtagsOnPosts.findMany({
      where: {
        hashtagId: hashtag,
      },
      include: {
        post: true,
      },
    })

    return new Response(JSON.stringify(posts))
  } catch (err) {
    const message: string = "Somethign went wrong. Please try again."
    return new Response(message, { status: 500 })
  }
}
