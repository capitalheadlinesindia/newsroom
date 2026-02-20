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

          {/* Center: block logo */}
          <Link href="/" className="flex gap-[2px]">
            {["N","E","W","S"].map((letter) => (
              <span
                key={letter}
                className="flex items-center justify-center w-9 h-9 bg-black text-white font-extrabold text-base select-none"
              >
                {letter}
              </span>
            ))}
          </Link>

          {/* Right: Register + Sign In */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="bg-black text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-[6px] hover:bg-gray-800 whitespace-nowrap">
              Register
            </button>
            <button className="hidden sm:block text-sm font-bold hover:underline whitespace-nowrap">
              Sign In
            </button>
          </div>

        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

