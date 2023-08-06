import { FC, useRef } from "react"
import { MessageSquare } from "lucide-react"
import { ExtendedPost } from "@/types/db"
import EditorOutput from "./EditorOutput"
import PostVoteClient from "./vote/PostVoteClient"

interface PostProps {
  communityName: string | undefined
  post: ExtendedPost
  commentAmt: number
}

const Post: FC<PostProps> = ({ communityName, post, commentAmt }) => {
  // to dynamically track its height
  const postRef = useRef<HTMLElement>(null)

  return (
    <div className="border rounded border-slate-200">
      <div className="px-6 py-4 flex justify-between">
        {/* post votes */}

        {/* preview component for each post */}
        <div className="w-0 flex-1">
          <div className="max-h-40 my-1 text-xs text-gray-500">
            {communityName ? (
              <>
                {/* hard reloading using a tag */}
                <a className="underline" href={`/c/${communityName}`}>
                  c/{communityName}
                </a>
                <span className="px-1">*</span>
              </>
            ) : null}
            <span className="px=1">Posted by @${post.author.username} </span>
            {/* {formatTimeToNow(new Date(post.createdAt))} */}
          </div>
          {/* hard refresh to fetch comments together */}
          <a href={`/c/${communityName}/post/{post.id}`}>
            <h1 className="text-md font-semibold py-2 leading-6 text-gray-800">
              {post.title}
            </h1>
          </a>
          {/* if the preview is longer than 160px, cut it and blur the bottom edge */}
          <div className="relative text-sm max-h-40 w-full overflow-clip ref={postRef}">
            <EditorOutput content={post.content} />
            {postRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent'" />
            ) : null}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 z-20 text-sm p-2 sm:px-6 flex justify-between">
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={2}
          initialVote={null}
        />
        <a
          className="w-fit flex items-center gap-2"
          href={`/c/${communityName}/post/${post.id}`}
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt}
        </a>
      </div>
    </div>
  )
}

export default Post
