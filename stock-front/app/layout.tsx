import Sidebar from "@/components/sidebar/Sidebar"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar"
import { Toaster } from "@/components/ui/toaster"
import Providers from "./Providers"

// const font = Nunito({ subsets: ["latin"] })
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

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
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="antialiased">
        <Providers>
          <div className="min-h-screen">
            <Sidebar />
            {/* ts expect error for ServerComponent */}
            <Navbar />
            {authModal}
            <div className="container h-full max-w-7xl mx-auto pt-12">
              {children}
            </div>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
