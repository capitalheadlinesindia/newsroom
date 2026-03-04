import Link from "next/link"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

const legalLinks = [
  "Terms of Use",
  "About Capital Headlines",
  "Privacy Policy",
  "Cookies",
  "Accessibility Help",
  "Contact Us",
  "Advertise with Us",
]

export default async function Footer() {
  let cats: any[] = []
  try {
    const res = await fetch(`${BACKEND}/api/categories?location=footer`, { next: { revalidate: 60 } })
    if (res.ok) cats = await res.json()
  } catch {}

  return (
    <footer className="bg-[#111] text-white mt-12">

      {/* Top branding bar */}
      <div className="max-w-screen-xl mx-auto px-4 py-8 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link href="/" className="flex flex-col leading-none select-none w-fit">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">Capital</span>
          <span className="font-serif font-black text-[26px] tracking-tight text-white uppercase">Headlines</span>
          <span className="block h-[3px] w-full bg-[#bb1919] mt-[2px]" />
        </Link>
        <p className="text-gray-400 text-sm max-w-sm">
          Breaking news, in-depth analysis and latest updates from India and around the world.
        </p>
      </div>

      {/* Categories */}
      {cats.length > 0 && (
        <div className="max-w-screen-xl mx-auto px-4 py-8 border-b border-gray-700">
          <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Topics</h3>
          <div className="flex flex-wrap gap-3">
            {cats.map((c: any) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="text-gray-400 text-sm hover:text-white border border-gray-700 px-3 py-1 hover:border-gray-400 transition"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Legal bar */}
      <div className="max-w-screen-xl mx-auto px-4 py-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        {legalLinks.map((l) => (
          <Link key={l} href="#" className="text-gray-500 text-xs hover:text-gray-300 transition">
            {l}
          </Link>
        ))}
        <span className="ml-auto text-gray-600 text-xs">
          © {new Date().getFullYear()} Capital Headlines. All rights reserved.
        </span>
      </div>

    </footer>
  )
}
