import Image from "next/image"
import Link from "next/link"
import SectionHeader from "./SectionHeader"

const videos = [
  {
    slug: "#",
    image: "https://picsum.photos/seed/v1/400/250",
    title: "Thai police go undercover as lion dancers to catch thief",
    excerpt:
      "The suspect was caught outside a temple on the outskirts of Bangkok.",
    category: "Asia",
  },
  {
    slug: "#",
    image: "https://picsum.photos/seed/v2/400/250",
    title: "Margot Robbie's accent was 'too Australian' for Neighbours",
    excerpt:
      "The actress reveals that she had a dialect coach when she was on the series because her accent was so strong.",
    category: "Film & TV",
  },
  {
    slug: "#",
    image: "https://picsum.photos/seed/v3/400/250",
    title: "US kids talk about chasing Olympic glory alongside elite figure skaters",
    excerpt:
      "They skate in the same rink as Ilia Malinin, and they're dreaming of their shot at Olympic medals.",
    category: "US & Canada",
  },
  {
    slug: "#",
    image: "https://picsum.photos/seed/v4/400/250",
    title: "'We can never do too much' - Slot wants football to do more against racism",
    excerpt:
      "Liverpool head coach Arne Slot says \"we should always try to do more\" after Real Madrid's Vinicius Jr allegedly received racist abuse.",
    category: "Champions League",
  },
  {
    slug: "#",
    image: "https://picsum.photos/seed/v5/400/250",
    title: "Martial law, president tried — how did South Korea get here?",
    excerpt: "A court is due to decide on a landmark case following the insurrection attempt.",
    category: "Asia",
  },
]

export default function MustWatch() {
  return (
    <section className="bg-[#111] py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-600 pb-2 mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">Must Watch</h2>
            <span className="text-white font-bold text-sm">›</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-7 h-7 border border-gray-500 text-white text-sm flex items-center justify-center hover:border-white">‹</button>
            <button className="w-7 h-7 border border-gray-500 text-white text-sm flex items-center justify-center hover:border-white">›</button>
          </div>
        </div>

        {/* Scrollable row */}
        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
          {videos.map((v) => (
            <Link href={v.slug} key={v.title} className="flex-shrink-0 w-72 sm:w-80">
              <article className="group cursor-pointer">
                <div className="relative overflow-hidden">
                  <Image
                    src={v.image}
                    alt={v.title}
                    width={400}
                    height={250}
                    className="w-full h-44 object-cover group-hover:opacity-80 transition"
                  />
                  {/* Play button */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 w-7 h-7 flex items-center justify-center">
                    <span className="text-white text-xs ml-[2px]">▶</span>
                  </div>
                </div>
                <h3 className="text-white font-serif text-[15px] font-bold leading-snug mt-2 group-hover:underline">
                  {v.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{v.excerpt}</p>
                <p className="text-gray-500 text-xs mt-2 font-bold uppercase tracking-wide">{v.category}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
