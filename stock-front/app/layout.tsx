import Sidebar from "@/components/sidebar/Sidebar"
import "./globals.css"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import Navbar from "@/components/Navbar"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./Providers"

const font = Nunito({ subsets: ["latin"] })
export const metadata: Metadata = {
  title: "QuantQuant",
  description: "Stock investment community",
}

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Providers>
          <div className="flex gap-5 min-h-screen">
            <Sidebar />
            <Navbar />
            {authModal}
            <div className="container h-screen max-w-7xl mx-auto pt-16 md:ml-[3rem]">
              {children}
            </div>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
