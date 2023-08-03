import Link from "next/link"
import { getAuthSession } from "@/app/options"
import { Icons } from "./Icons"

import UserAccountNav from "./UserAccountNav"
import SignInButton from "./SignInButton"

const Navbar = async () => {
  const session = await getAuthSession()

  return (
    <div className="fixed top-0 inset-x-0 h-fit z-[998] py-2 ml-5">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo */}
        <Link href="/" className="flex gap-2 items-center ml-4 z-[1000]">
          <Icons.LOGO className="h-8 w-8 sm:h-6 sm:w-6" />

          <p
            className={`hidden md:block text-sm font-medium
          `}
          >
            QuantQuant
          </p>
        </Link>

        {/* Search bar */}
        <div className="relative">Search bar</div>

        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  )
}

export default Navbar
