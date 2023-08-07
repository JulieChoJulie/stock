"use client"

import { CSSProperties, FC } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { CustomImageRenderer } from "./CustomImageRenderer"

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false },
)

interface EditorOutputProps extends React.HTMLAttributes<HTMLDivElement> {
  content: any
  styleProps?: CSSProperties
}

const renderers = {
  image: CustomImageRenderer,
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    overflowWrap: "break-word",
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
