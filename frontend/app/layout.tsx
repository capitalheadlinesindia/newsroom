import "./globals.css"
import Header from "./components/Header"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

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
