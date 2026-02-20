import Image from "next/image"
import Link from "next/link"

const relatedStories = [
  {
    href: "#",
    image: "https://picsum.photos/seed/r1/300/200",
    title: "How the Vanderbilt family shaped American architecture",
    date: "12 Feb 2026",
  },
  {
    href: "#",
    image: "https://picsum.photos/seed/r2/300/200",
    title: "The Gilded Age mansions you can still visit today",
    date: "8 Feb 2026",
  },
  {
    href: "#",
    image: "https://picsum.photos/seed/r3/300/200",
    title: "Inside America's most expensive real estate listings",
    date: "3 Feb 2026",
  },
  {
    href: "#",
    image: "https://picsum.photos/seed/r4/300/200",
    title: "Why the super-rich are buying up historic estates",
    date: "28 Jan 2026",
  },
]

export default function HistoricUsHomePage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── MAIN ARTICLE ─────────────────────────────── */}
          <article className="flex-1 min-w-0">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Link href="/" className="hover:underline">Home</Link>
              <span>›</span>
              <Link href="/category/travel" className="hover:underline text-[#bb1919] font-bold uppercase tracking-wide">
                Travel
              </Link>
              <span>›</span>
              <span className="truncate max-w-[200px]">The historic US home that embodied the super-rich</span>
            </div>

            {/* Category */}
            <Link href="/category/travel">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#bb1919] mb-3">
                Travel
              </span>
            </Link>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-black mb-4">
              The historic US home that embodied the super-rich
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-gray-600 leading-relaxed mb-6 border-l-4 border-gray-900 pl-4">
              The largest privately owned home in the US, Biltmore House was an &quot;American chateau
              built on the scale of a European palace&quot;. It reveals much about the dreams of the
              US&apos;s one per cent.
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
              <span>By <span className="font-bold text-black">Newsroom Travel Desk</span></span>
              <span className="w-px h-4 bg-gray-300" />
              <time>19 February 2026</time>
              <span className="w-px h-4 bg-gray-300" />
              <span>6 min read</span>
              <div className="ml-auto flex items-center gap-2">
                <button className="w-8 h-8 rounded-full bg-[#1877f2] text-white text-xs flex items-center justify-center font-bold hover:opacity-80">f</button>
                <button className="w-8 h-8 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold hover:opacity-80">𝕏</button>
                <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center hover:opacity-80">✉</button>
              </div>
            </div>

            {/* Hero image */}
            <div className="mb-8">
              <Image
                src="https://picsum.photos/seed/f1/1200/675"
                alt="Biltmore House, Asheville, North Carolina"
                width={1200}
                height={675}
                className="w-full object-cover"
                priority
              />
              <p className="text-xs text-gray-500 mt-2">
                Biltmore House in Asheville, North Carolina — the largest privately owned home in
                the United States. (Getty Images)
              </p>
            </div>

            {/* Body */}
            <div className="article-body max-w-2xl">
              <p>
                Nestled in the Blue Ridge Mountains of North Carolina, Biltmore House stands as
                one of the most extraordinary testaments to American wealth ever built. Constructed
                between 1889 and 1895 for George Washington Vanderbilt II, the château-style mansion
                sprawls across 178,926 square feet — a number so staggering it still holds the record
                for the largest privately owned residence in the United States.
              </p>

              <p>
                George Vanderbilt, the youngest son of William Henry Vanderbilt and grandson of
                railroad magnate Cornelius Vanderbilt, conceived the estate as a grand country retreat
                after being enchanted by the Asheville area during a visit in the 1880s. He purchased
                125,000 acres of what was then largely depleted farmland, and set about transforming
                it into a self-sustaining European-style estate.
              </p>

              <h2>An American Versailles</h2>

              <p>
                Vanderbilt commissioned architect Richard Morris Hunt, the first American to graduate
                from the École des Beaux-Arts in Paris, to design the home. Hunt drew inspiration from
                the châteaux of the Loire Valley — particularly Château de Blois, Château d&apos;Azay-le-Rideau,
                and Château de Chambord — creating what one contemporary observer described as &quot;an
                American chateau built on the scale of a European palace.&quot;
              </p>

              <p>
                The building process required its own three-mile railway spur to transport stone,
                brick, and 40 million hand-made bricks from a dedicated on-site kiln. At the height
                of construction, more than 1,000 workers were employed on the estate. The limestone
                facade alone took over six years to complete.
              </p>

              <Image
                src="https://picsum.photos/seed/f1b/1200/675"
                alt="The grand interior of Biltmore House"
                width={1200}
                height={675}
                className="w-full object-cover my-6"
              />
              <p className="text-xs text-gray-500 mb-6">
                The Banquet Hall inside Biltmore, designed to seat 64 guests. (Biltmore Estate)
              </p>

              <h2>Inside the 250 rooms</h2>

              <p>
                The estate boasts 250 rooms, including 35 bedrooms, 43 bathrooms, and 65 fireplaces.
                The Banquet Hall — 72 feet long and patterned after the great halls of medieval Europe
                — could seat 64 guests beneath triple-arched fireplaces and a vaulted ceiling hung
                with hand-painted banners.
              </p>

              <p>
                Beneath the mansion lies an entire floor of recreational and service rooms: a bowling
                alley, an indoor swimming pool 70 feet long, a gymnasium, and a Halloween room used
                for seasonal parties. The wine cellar, still operational, holds up to 25,000 bottles
                — the Biltmore Estate winery has become the most visited in the United States.
              </p>

              <blockquote>
                &quot;It is the most distinguished private house in the United States. It is the only
                complete work of domestic architecture in that country that can be ranked with the
                great houses of Europe.&quot; — architectural historian Henry-Russell Hitchcock
              </blockquote>

              <h2>What it tells us about the Gilded Age</h2>

              <p>
                Biltmore was completed in 1895, at the height of what Mark Twain dubbed the &quot;Gilded
                Age&quot; — a period of explosive industrial wealth and naked inequality. The Vanderbilt
                family fortune, accumulated through railroads and shipping, placed them among the
                richest families in American history. At its peak, the family&apos;s wealth was estimated
                at the equivalent of tens of billions in today&apos;s dollars.
              </p>

              <p>
                The estate employed a permanent staff of over 80 servants, alongside hundreds of
                agricultural workers managing the farms, forests, and gardens designed by landscape
                architect Frederick Law Olmsted — the same man who designed New York&apos;s Central Park.
                Olmsted&apos;s vision for the estate&apos;s 8,000 acres of managed forest became the birthplace
                of American scientific forestry.
              </p>

              <h2>A home that outlasted its era</h2>

              <p>
                George Vanderbilt died in 1914, and the estate passed to his wife Edith and their
                daughter Cornelia. Facing mounting costs, the family sold 87,000 acres to the federal
                government in 1930, land that became the Pisgah National Forest. Cornelia and her
                husband Lord John Cecil opened the house to the public in 1930 to help cover upkeep
                costs — a decision that has proven remarkably far-sighted.
              </p>

              <p>
                Today, Biltmore Estate is still owned by the Vanderbilt descendants — specifically
                William A.V. Cecil and his family — and remains a thriving private enterprise drawing
                over 1.4 million visitors a year. It operates as a hotel, winery, and event venue,
                generating revenues that fund its own ongoing preservation.
              </p>

              <p>
                In an era of renewed debate about extreme wealth and inequality, Biltmore stands as
                a peculiarly American monument: overwhelming in its ambition, extraordinary in its
                craftsmanship, and almost incomprehensible in its scale. It was built to impress —
                and a century later, it still does.
              </p>
            </div>

            {/* Bottom share */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-3">
              <Link href="/category/travel" className="border border-gray-300 text-xs px-3 py-1 font-semibold hover:bg-gray-100 transition">
                Travel
              </Link>
              <Link href="#" className="border border-gray-300 text-xs px-3 py-1 font-semibold hover:bg-gray-100 transition">
                History
              </Link>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">Share</span>
                <button className="w-7 h-7 rounded-full bg-[#1877f2] text-white text-xs flex items-center justify-center font-bold hover:opacity-80">f</button>
                <button className="w-7 h-7 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold hover:opacity-80">𝕏</button>
                <button className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center hover:opacity-80">✉</button>
              </div>
            </div>

          </article>

          {/* ── SIDEBAR ──────────────────────────────────── */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              <div className="border-b-2 border-gray-900 pb-2 mb-4">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-black">
                  More on this topic
                </h2>
              </div>
              <div className="space-y-4">
                {relatedStories.map((rel) => (
                  <Link href={rel.href} key={rel.title}>
                    <div className="group flex gap-3 items-start border-b border-gray-200 pb-4 cursor-pointer">
                      <div className="flex-shrink-0 w-20 h-14 overflow-hidden">
                        <Image
                          src={rel.image}
                          alt={rel.title}
                          width={200}
                          height={130}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-sm font-bold leading-snug group-hover:underline text-black line-clamp-3">
                          {rel.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">{rel.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/category/travel"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition"
              >
                More Travel ›
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </main>
  )
}
