"use client"

import { FC, useRef } from "react"
import Image from "next/image"
import EditorOutput from "./EditorOutput"

interface PostPreviewProps {
  content: any
}

const PostPreview: FC<PostPreviewProps> = ({ content }) => {
  const pRef = useRef(null)

  // Filter out the objects with type 'image'
  const filteredImage = content.blocks.find((block) => block.type === "image")

  // Filter out the objects with type 'image'
  const filteredBlocks = content.blocks.filter(
    (block) => block.type !== "image",
  )

  // Create a new content object with the filtered blocks
  const filteredContent = { ...content, blocks: filteredBlocks }

  return (
    <div
      className="relative text-sm max-h-[6rem] w-full overflow-clip text-ellipsis"
      ref={pRef}
    >
      {filteredImage ? (
        <div className="flex">
          <div className="flex-auto break-words	w-1/2 pr-4">
            <EditorOutput content={filteredContent} style={{ flex: 1 }} />
          </div>
          <div className="w-[5rem] flex-none">
            <Image
              alt="image in post"
              src={filteredImage.data.file.url}
              width={80}
              height={80}
            />
          </div>
        </div>
      ) : (
        <EditorOutput content={filteredContent} />
      )}
      {pRef.current?.clientHeight === 96 ? (
        // blur bottom if content is too long
        <div className="absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-white to-transparent" />
      ) : null}
    </div>
  )
}

export default PostPreview
