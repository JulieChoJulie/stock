import Link from "next/link"

export async function HashtagRenderer({ data }: any) {
  const { text } = data
  const segments = text.split(/(#[^\s#]+)/g)

  return (
    <p>
      {segments.map((val: string) => {
        if (val.match(/(#[^\s#]+)/)) {
          return (
            <Link
              className="text-green-600 font-semibold"
              key={`${val}_${Math.random()}`}
              href={`/hashtag/${val.slice(1)}`}
            >
              {val}
            </Link>
          )
        }
        return val
      })}
    </p>
  )
}
