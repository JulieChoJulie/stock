"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import type EditorJS from "@editorjs/editorjs"
import { PostCreationRequest, PostValidator } from "@/lib/validators/post"
import { toast } from "@/hooks/use-toast"
import { usePathname, useRouter } from "next/navigation"
import { useCreatePostMutation } from "@/redux/services/post/postApi"
import { Button } from "../ui/button"

interface EditorProps {
  communityId: string
}

const Editor: FC<EditorProps> = ({ communityId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      communityId,
      title: "",
      content: null,
    },
  })
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const ref = useRef<EditorJS>()
  const _titleRef = useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default
    const Header = (await import("@editorjs/header")).default
    const Embed = (await import("@editorjs/embed")).default
    const Table = (await import("@editorjs/table")).default
    const List = (await import("@editorjs/list")).default
    const Code = (await import("@editorjs/code")).default
    const LinkTool = (await import("@editorjs/link")).default
    const InlineCode = (await import("@editorjs/inline-code")).default
    const ImageTool = (await import("@editorjs/image")).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const formData = new FormData()
                  formData.append("file", file)
                  const res = await fetch("/api/image", {
                    method: "POST",
                    body: formData,
                  })

                  const data = await res.json()

                  return {
                    success: 1,
                    file: {
                      url: data.url,
                    },
                  }
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [__key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        })
      }
    }
  }, [errors])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()

      // move this call to end of the call stack
      setTimeout(() => {
        _titleRef?.current?.focus()
      }, 0)
    }

    if (isMounted) {
      init()

      return () => {
        // uninitialize editor
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  const { ref: titleRef, ...rest } = register("title")

  const [createPost, { isLoading }] = useCreatePostMutation()

  const onSubmit = async (data: PostCreationRequest) => {
    const blocks = await ref.current?.save()

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      communityId,
    }

    createPost(payload)
      .unwrap()
      .then(() => {
        const newPathname = pathname.split("/").slice(0, -1).join("/")
        router.push(newPathname)
        router.refresh()

        toast({
          title: "Successful",
          description: "Your post has been published.",
        })
      })
      .catch((err) => {
        toast({
          description:
            err?.data?.message ?? "Somethig went wrong.. Please try again.",
          variant: "destructive",
        })
      })
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      <div className="w-full flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
          form="community-post-form"
        >
          Create Post
        </Button>
      </div>
      <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
        <form
          id="community-post-form"
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="prose prose-stone dark:prose-invert">
            <TextareaAutosize
              ref={(e) => {
                titleRef(e)
                _titleRef.current = e // ignore ts error
              }}
              {...rest}
              placeholder="title"
              className="w-ful resize-none appearance-none overlfow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            />

            <div id="editor" className="min-h-[500px]" />
          </div>
        </form>
      </div>
    </>
  )
}

export default Editor
