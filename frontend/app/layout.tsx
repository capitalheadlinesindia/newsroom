import type { Metadata } from "next"
import "./globals.css"
import Header from "./components/Header"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

export const metadata: Metadata = {
  title: "Capital Headlines",
  description: "Breaking news, in-depth analysis and latest updates from India and around the world.",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Header />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
