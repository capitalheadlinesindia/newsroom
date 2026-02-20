"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const categories = [
  { label: "Home", href: "/" },
  { label: "News", href: "/category/news" },
  { label: "Sport", href: "/category/sport" },
  { label: "Business", href: "/category/business" },
  { label: "Technology", href: "/category/technology" },
  { label: "Health", href: "/category/health" },
  { label: "Culture", href: "/category/culture" },
  { label: "Arts", href: "/category/arts" },
  { label: "Travel", href: "/category/travel" },
  { label: "Earth", href: "/category/earth" },
  { label: "Audio", href: "/category/audio" },
  { label: "Video", href: "/category/video" },
  { label: "Live", href: "/category/live" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center overflow-x-auto scrollbar-hide md:justify-center gap-0">
        {categories.map((cat) => {
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
