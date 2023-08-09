import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import PostComment from "./PostComment"
import CreateComment from "./CreateComment"

interface CommentSectionProps {
  postId: string
}

const CommentSection = async ({ postId }: CommentSectionProps) => {
  const session = await getAuthSession()
  const comments = await db.comment.findMany({
    where: {
      postId,
      replyTo: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  return (
    <div className="flex flex-col gap-y-3 mt-3 p-3">
      <CreateComment postId={postId} />
      <div className="flex flex-col gap-y-4 mt-4">
        {/* only map the top level comment */}
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const votesAmt: number = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1
                return acc
              },
              0,
            )

            const vote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id,
            )
            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment comment={topLevelComment} />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default CommentSection
