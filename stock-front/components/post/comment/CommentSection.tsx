import { Session } from "next-auth"
import { Comment, CommentVote } from "@prisma/client"
import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import PostComment from "./PostComment"
import CreateComment from "./CreateComment"

interface CommentSectionProps {
  postId: string
}

type CommentWithVotes = Comment & { votes: CommentVote[] }

function getVoteStat(comment: CommentWithVotes, session: Session | null) {
  const votesAmt: number = comment.votes.reduce((acc, vote) => {
    if (vote.type === "UP") return acc + 1
    return acc
  }, 0)

  const currentVote = comment.votes.find(
    (vote) => vote.userId === session?.user.id,
  )

  return { votesAmt, currentVote }
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
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  return (
    <div className="flex flex-col gap-y-3 mt-3 p-3">
      <CreateComment postId={postId} />
      <div className="flex flex-col gap-y-4 mt-4">
        {/* only map the top depth level comment order by popularity */}
        {comments
          .sort(
            (a, b) =>
              b.votes.length +
              b.replies.length * 2 -
              (a.votes.length + a.replies.length * 2),
          )
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const { votesAmt, currentVote } = getVoteStat(
              topLevelComment,
              session,
            )

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={topLevelComment}
                    postId={postId}
                    votesAmt={votesAmt}
                    currentVote={currentVote}
                  />
                </div>
                {/* render replies to top level coment */}
                <div className="ml-4 border-l-2 border-indigo-300">
                  {topLevelComment.replies.map((reply) => {
                    const { votesAmt, currentVote } = getVoteStat(
                      reply,
                      session,
                    )
                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-4 border-zinc-200"
                      >
                        <PostComment
                          comment={reply}
                          postId={postId}
                          currentVote={currentVote}
                          votesAmt={votesAmt}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default CommentSection
