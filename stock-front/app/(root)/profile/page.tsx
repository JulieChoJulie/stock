import { redirect } from "next/navigation"
import Link from "next/link"
import { getAuthSession } from "@/app/options"
import UsernameForm from "@/components/profile/UsernameForm"
import { db } from "@/lib/db"
import { Card, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Profile",
  description: "Manage account",
}

const page = async () => {
  const session = await getAuthSession()
  if (!session || !session.user) {
    redirect(`/sign-in?callbackUrl=/profile`)
  }

  const subscriptions = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      community: true,
    },
  })

  const createdCommunities = await db.community.findMany({
    where: {
      creatorId: session.user.id,
    },
  })

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-center mb-4">
        <h1 className="font-bold text-3xl md:text-4xl">Profile</h1>
      </div>

      <div className="grid gap-10">
        <Card className="p-4">
          <UsernameForm
            user={{
              id: session?.user.id || "",
              username: session?.user?.username || "",
            }}
          />
          <div className="flex flex-col space-y-2 mt-4">
            <CardTitle>Your Subscribed Communities</CardTitle>
            {subscriptions.map((subscription) => {
              const { community } = subscription
              return (
                <div key={community.id}>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "border-none",
                    )}
                    href={`/c/${community.name}`}
                  >
                    c/{community.name}
                  </Link>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col space-y-2 mt-4">
            <CardTitle>Your Created Communities</CardTitle>
            {createdCommunities.map((community) => {
              return (
                <div key={community.id}>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "border-none",
                    )}
                    href={`/c/${community.name}`}
                  >
                    c/{community.name}
                  </Link>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default page
