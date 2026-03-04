"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

const buildItems = (cats: any[]) => [{ label: "Home", href: "/", hasChevron: false }, ...cats.map(c => ({ label: c.title, href: `/category/${c.slug}`, hasChevron: true }))]

export default function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const pathname = usePathname()
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    fetch(`${BACKEND}/api/categories?location=navbar`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setItems(buildItems(Array.isArray(data) ? data : []))
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  return (
    <>
      {/* Backdrop — invisible, just catches outside clicks */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-2xl font-light text-black hover:opacity-60 transition"
          >
            ✕
          </button>
        </div>

        {/* Search bar */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-200">
          <div className="flex items-center border border-gray-300">
            <input
              type="text"
              placeholder="Search news, topics and more"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm px-3 py-2 outline-none bg-white text-black placeholder-gray-500"
            />
            <button className="bg-[#222] hover:bg-black px-3 py-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          {items.map((cat) => {
            const isActive =
              cat.href === "/"
                ? pathname === "/"
                : pathname.startsWith(cat.href)

            return (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-4 border-b border-gray-200 text-[15px] font-semibold text-black hover:bg-gray-50 transition ${
                  isActive ? "border-l-[4px] border-l-black pl-3" : ""
                }`}
              >
                <span>{cat.label}</span>
                {cat.hasChevron && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
