import Link from "next/link"

const footerLinks = [
  {
    heading: "News",
    links: ["World", "UK", "Business", "Politics", "Tech", "Science", "Health", "Education"],
  },
  {
    heading: "Sport",
    links: ["Football", "Cricket", "Formula 1", "Rugby Union", "Tennis", "Golf", "Athletics"],
  },
  {
    heading: "Culture",
    links: ["Film", "Music", "TV & Radio", "Arts", "Books", "Style"],
  },
  {
    heading: "Travel",
    links: ["Destinations", "Adventure", "Food & Drink", "Hotels", "City guides"],
  },
]

const legalLinks = [
  "Terms of Use",
  "About Newsroom",
  "Privacy Policy",
  "Cookies",
  "Accessibility Help",
  "Contact Us",
  "Advertise with Us",
]

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white mt-12">

      {/* Top logo bar */}
      <div className="max-w-screen-xl mx-auto px-4 py-6 border-b border-gray-700 flex items-center gap-2">
        <Link href="/" className="flex gap-[2px]">
          {["N","E","W","S"].map((letter) => (
            <span
              key={letter}
              className="flex items-center justify-center w-8 h-8 bg-white text-black font-extrabold text-sm select-none"
            >
              {letter}
            </span>
          ))}
        </Link>
        <span className="text-gray-400 text-xs ml-2">© 2026 Newsroom. All rights reserved.</span>
      </div>

      {/* Link columns */}
      <div className="max-w-screen-xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {footerLinks.map((col) => (
          <div key={col.heading}>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-3">
              {col.heading}
            </h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="text-gray-400 text-sm hover:text-white transition"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Legal bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-wrap gap-x-5 gap-y-2">
          {legalLinks.map((l) => (
            <Link
              key={l}
              href="#"
              className="text-gray-500 text-xs hover:text-gray-300 transition"
            >
              {l}
            </Link>
          ))}
        </div>
      </div>

    </footer>
  )
}
