import Sidebar from "@/components/sidebar/Sidebar";
import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Navbar from "@/components/Navbar";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuantQuant",
  description: "Stock investment community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div className="flex gap-5 min-h-screen">
          <Sidebar>
            <Navbar />
            <div className="container max-w-7xl mx-auto pt-12">{children}</div>
          </Sidebar>
        </div>
      </body>
    </html>
  );
}
