"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { buttonVariants } from "./ui/button"

const SignInButton = () => {
  const pathname = usePathname()
  return (
    <Link
      href={`/sign-in?callbackUrl=${pathname}`}
      className={buttonVariants()}
    >
      Sign In
    </Link>
  )
}

export default SignInButton
