import { redirect } from "next/navigation"
import { getAuthSession } from "@/app/options"
import UsernameForm from "@/components/profile/UsernameForm"

export const metadata = {
  title: "Profile",
  description: "Manage account",
}

const page = async () => {
  const session = await getAuthSession()
  if (!session || !session.user) {
    redirect(`/sign-in?callbackUrl=/profile`)
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-center mb-4">
        <h1 className="font-bold text-3xl md:text-4xl">Profile</h1>
      </div>

      <div className="grid gap-10">
        <UsernameForm
          user={{
            id: session?.user.id || "",
            username: session?.user?.username || "",
          }}
        />
      </div>
    </div>
  )
}

export default page
