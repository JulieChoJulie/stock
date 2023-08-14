import Link from "next/link"

export async function HashtagRenderer({ data }: any) {
  const { text } = data
  const segments = text.split(/(#[^\s#]+)/g)

  return (
    <p>
      {segments.map((val: string, index: number) => {
        if (val.match(/(#[^\s#]+)/)) {
          return (
            <span
              key={`${val}-${Math.random()}`}
              className="text-green-600 font-semibold hover:underline-offset-2"
            >
              <Link href={`/hashtag/${val.slice(1)}`}>{val}</Link>
            </span>
          )
        }
        return val
      })}
    </p>
  )
}
