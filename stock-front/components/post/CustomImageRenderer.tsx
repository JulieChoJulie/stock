import Image from "next/image"

export async function CustomImageRenderer({ data }: any) {
  const src = data.file.url as string

  return (
    <div className="relative w-full min-h-[15rem] overflow-hidden">
      <Image
        alt="image in post"
        width="0"
        height="0"
        sizes="100vh"
        className="h-full w-auto"
        // className="object-contain"
        src={src}
      />
    </div>
  )
}
