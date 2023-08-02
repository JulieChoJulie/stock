import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"
import { isLoggedInMiddleware } from "./middlewares/isLoggedInMiddleware"

type middlewareFunction = (
  request: NextRequest,
  response: NextResponse,
) => NextResponse | Promise<NextResponse>
const MIDDLEWARES: middlewareFunction[] = [isLoggedInMiddleware]

function isRedirecting(response: NextResponse): boolean {
  return response.status === 307 || response.status === 308
}
function isRewriting(response: NextResponse): boolean {
  return response.headers.has("x-middleware-rewrite")
}

function isPage(pathname: string): boolean {
  return (
    pathname.startsWith("/c/create") ||
    // pathname.includes("/submit") ||
    pathname.startsWith("/sign-out") ||
    /^\/c\/([^/]+)\/submit$/.test(pathname) // "/c/:path/submit"
  )
}

export default withAuth(
  async function middleware(request: NextRequest) {
    const response = NextResponse.next()
    for await (const middlewareFunction of MIDDLEWARES) {
      const middlewareResponse = await middlewareFunction(request, response)
      if (isRedirecting(middlewareResponse)) {
        return middlewareResponse
      }
      if (isRewriting(middlewareResponse)) {
        return middlewareResponse
      }
    }
    return response
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl
        if (isPage(pathname) && token === null) {
          return false
        }

        return true
      },
    },
  },
)
