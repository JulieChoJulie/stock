import { db } from "@/lib/db"

interface pageProps {
  params: {
    slug: string
  }
}

const page = ({ params }: pageProps) => {
  return <div>{params.slug}</div>
}

export default page
