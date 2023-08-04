"use client"

import { FC } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false },
)

interface EditorOutputProps {
  content: any
}

function CustomImageRenderer({ data }: any) {
  const src = data.file.url

  return (
    <div className="relative w-full min-h-[15rem]">
      <Image alt="image" className="object-contain" fill src={src} />
    </div>
  )
}

const renderers = {
  image: CustomImageRenderer,
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    // @ts-expect-error
    <Output
      style={style}
      className="text-sm"
      renderers={renderers}
      data={content}
    />
  )
}

export default EditorOutput
