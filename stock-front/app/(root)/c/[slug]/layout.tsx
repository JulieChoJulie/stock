import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { setCommunityPayloadType } from "@/types/payloadTypes"
import Preloader from "@/components/community/Preloader"
import CommunityInfo from "@/components/community/CommunityInfo"
import format from "date-fns/format"

const layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode
  params: { slug: string }
}) => {
  const session = await getAuthSession()
  const community = await db.community.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          community: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      })

  const isSubscribed = !!subscription
  if (!community) return notFound()

  const memberCount = await db.subscription.count({
    where: {
      community: {
        name: slug,
      },
    },
  })

  // pass datan to Preloader component to pre-render
  // from server to client component
  const communityData: setCommunityPayloadType = {
    isSubscribed,
    memberCount,
    creatorId: community.creatorId,
    posts: community.posts,
    communityName: community.name,
    communityId: community.id,
  }

  return (
    <>
      <Preloader communityData={communityData} />
      <div className="sm:container max-w-7xl mx-auto h-full pt-12">
        <div>
          {/* button to take us back */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            <div className="flex flex-col col-span-2 space-y-6">{children}</div>
            {/* info sidebar */}
            <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
              <div className="px-6 py-4">
                <p className="font-semibold py-3">About r/{slug}</p>
              </div>
              <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-slate-50">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-700">
                    <time dateTime={community.createdAt.toDateString()}>
                      {format(community.createdAt, "MMMM d, yyyy")}
                    </time>
                  </dd>
                </div>
                <CommunityInfo />
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default layout
