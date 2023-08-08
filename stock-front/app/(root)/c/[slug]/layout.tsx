import format from "date-fns/format"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getAuthSession } from "@/app/options"
import { db } from "@/lib/db"
import { buttonVariants } from "@/components/ui/button"
import { CommunityPropType } from "@/types/propTypes"
import SubscribeToggle from "@/components/community/SubscribeToggle"

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
        orderBy: {
          createdAt: "desc",
        },
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

  const communityData: CommunityPropType = {
    communityName: community.name,
    isSubscribed,
    communityId: community.id,
  }

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        {/* button to take us back */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>
          {/* info sidebar */}
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
              <a href={`/c/${slug}`}>
                <p className="font-semibold py-3">About c/{slug}</p>
              </a>
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
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-700">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>

              {community.creatorId === session?.user.id && (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-gray-500">You created this community</p>
                </div>
              )}

              {community.creatorId !== session?.user.id ? (
                <SubscribeToggle communityData={communityData} />
              ) : null}

              {session?.user && isSubscribed && (
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full mb-6",
                  })}
                  href={`/c/${slug}/submit`}
                >
                  Create Post
                </Link>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default layout
