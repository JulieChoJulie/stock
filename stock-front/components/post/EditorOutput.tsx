"use client"

import { CSSProperties, FC } from "react"
import dynamic from "next/dynamic"
import { CustomImageRenderer } from "./CustomImageRenderer"
import { HashtagRenderer } from "./HashtagRenderer"

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false },
)

interface EditorOutputProps extends React.HTMLAttributes<HTMLDivElement> {
  content: any
  styleProps?: CSSProperties
}

type OverflowWrapValue = "normal" | "break-word" | "anywhere"

const renderers = {
  image: CustomImageRenderer,
  paragraph: HashtagRenderer,
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    overflowWrap: "break-word" as OverflowWrapValue,
  },
}

const EditorOutput: FC<EditorOutputProps> = ({ content, styleProps }) => {
  const combinedStyle: CSSProperties = styleProps
    ? { ...style.paragraph, ...styleProps }
    : style.paragraph

  return (
    // @ts-expect-error
    <Output
      style={combinedStyle}
      className="text-sm"
      renderers={renderers}
      data={content}
    />
  )
}

export default EditorOutput
