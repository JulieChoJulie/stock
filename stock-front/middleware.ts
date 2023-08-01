export { default } from "next-auth/middleware"

export const config = { matcher: ["/c/create", "/c/:path/submit"] }
