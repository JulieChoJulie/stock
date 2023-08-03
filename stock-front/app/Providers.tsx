"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"

const queryClient = new QueryClient()

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  )
}

export default Providers
