"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export default function Navbar() {
  const pathname = usePathname()
  const [cats, setCats] = useState<Array<any>>([])

  useEffect(() => {
    let mounted = true
    fetch(`${BACKEND}/api/categories?location=navbar`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setCats(Array.isArray(data) ? data : [])
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  const items = [{ label: "Home", href: "/" }, ...cats.map((c: any) => ({ label: c.title, href: `/category/${c.slug}` }))]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center overflow-x-auto scrollbar-hide md:justify-center gap-0">
        {items.map((cat) => {
          const isActive =
            cat.href === "/"
              ? pathname === "/"
              : pathname.startsWith(cat.href)

          return (
            <Link
              key={cat.href}
              href={cat.href}
              className={`text-sm font-medium px-3 py-3 whitespace-nowrap border-b-[3px] transition-colors ${
                isActive
                  ? "border-black text-black font-bold"
                  : "border-transparent text-black hover:border-gray-400"
              }`}
            >
              {cat.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
