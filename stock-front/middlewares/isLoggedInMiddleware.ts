import { homepageUrl } from "@/lib"
import { NextRequest, NextResponse } from "next/server"

export const isLoggedInMiddleware = (request: NextRequest) => {
  const { token } = request.nextauth
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/sign-in") && token) {
    return NextResponse.redirect(homepageUrl)
  }

  return NextResponse.next()
}
