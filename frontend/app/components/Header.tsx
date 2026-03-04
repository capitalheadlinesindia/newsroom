"use client"
import Link from "next/link"
import { useState } from "react"
import MobileMenu from "./MobileMenu"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="bg-white border-b border-gray-300">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Left: hamburger + search */}
          <div className="flex items-center gap-5">
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="flex flex-col gap-[5px] group"
            >
              <span className="block w-[22px] h-[2px] bg-black"></span>
              <span className="block w-[22px] h-[2px] bg-black"></span>
              <span className="block w-[22px] h-[2px] bg-black"></span>
            </button>
            <button aria-label="Search" onClick={() => setMenuOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            </button>
          </div>

          {/* Center: Capital Headlines wordmark */}
          <Link href="/" className="flex flex-col items-center leading-none select-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
              Capital
            </span>
            <span className="font-serif font-black text-[22px] tracking-tight text-black uppercase">
              Headlines
            </span>
            <span className="block h-[3px] w-full bg-[#bb1919] mt-[2px]" />
          </Link>

          {/* Right: spacer for layout balance */}
          <div className="w-[80px]" />

        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

