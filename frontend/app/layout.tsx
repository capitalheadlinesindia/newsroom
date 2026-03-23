import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import Header from "./components/Header"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

const GA_MEASUREMENT_ID = "G-ST934940NY"

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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Header />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
