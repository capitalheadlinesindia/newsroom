import Image from "next/image"
import Link from "next/link"
import SectionHeader from "./SectionHeader"

const left = [
  {
    slug: "#",
    title: "Sudan atrocities are 'hallmarks of genocide', UN says",
    excerpt:
      "A UN fact-finding mission issued the report after investigating the capture of el-Fasher by the Rapid Support Forces.",
    time: "8 hrs ago",
    category: "Africa",
  },
  {
    slug: "#",
    title: "Satellite images reveal scale of destruction in war-torn region",
    excerpt: "New satellite data shows widespread damage to civilian infrastructure across the affected areas.",
    time: "5 hrs ago",
    category: "World",
  },
]

const center = {
  slug: "#",
  image: "https://picsum.photos/seed/mn1/800/600",
  title: "White House presses Iran to make deal, while ramping up military presence",
  excerpt:
    "US media reports that Trump has discussed attack options with advisers, and a strike could happen as early as Saturday.",
  time: "10 hrs ago",
  category: "World",
}

const right = [
  {
    slug: "#",
    title: "South Korea's ex-president jailed for life over martial law attempt",
    excerpt:
      "Yoon Suk Yeol's December 2024 martial law bid fundamentally damaged South Korea's democracy, a judge told the court.",
    time: "6 hrs ago",
    category: "Asia",
  },
  {
    slug: "#",
    title: "Hamas is reasserting control in Gaza despite its heavy losses fighting Israel",
    excerpt:
      "Gazans say Hamas is again extending its control over security, tax revenue and government services.",
    time: "16 hrs ago",
    category: "Middle East",
  },
  {
    slug: "#",
    title: "BBC plans David Attenborough celebration for 100th birthday",
    excerpt:
      "The corporation will look back on the veteran wildlife broadcaster's career for his birthday in May.",
    time: "7 hrs ago",
    category: "",
  },
  {
    slug: "#",
    title: "Bill Gates pulls out of India's AI summit over Epstein files",
    excerpt: "Gates declined an invitation citing scheduling conflicts, sources say.",
    time: "3 hrs ago",
    category: "",
  },
]

export default function MoreNewsSection({ title }: { title: string }) {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <SectionHeader title={title} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left — text-heavy list */}
        <div className="space-y-5 md:border-r md:border-gray-200 md:pr-6">
          {left.map((item) => (
            <Link href={item.slug} key={item.title}>
              <article className="group cursor-pointer border-b border-gray-200 pb-4">
                <h3 className="font-serif text-lg font-bold leading-snug group-hover:underline text-black">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{item.excerpt}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {item.time}
                  {item.category && (
                    <> <span className="mx-1">|</span> <span className="text-black font-semibold">{item.category}</span></>
                  )}
                </p>
              </article>
            </Link>
          ))}
        </div>

        {/* Center — big image */}
        <Link href={center.slug}>
          <article className="group cursor-pointer md:border-r md:border-gray-200 md:pr-6">
            <Image
              src={center.image}
              alt={center.title}
              width={800}
              height={600}
              className="w-full h-72 object-cover"
            />
            <h3 className="font-serif text-xl font-bold leading-snug mt-3 group-hover:underline text-black">
              {center.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2">{center.excerpt}</p>
            <p className="text-xs text-gray-400 mt-2">
              {center.time} <span className="mx-1">|</span>{" "}
              <span className="text-black font-semibold">{center.category}</span>
            </p>
          </article>
        </Link>

        {/* Right — text list */}
        <div className="space-y-4">
          {right.map((item) => (
            <Link href={item.slug} key={item.title}>
              <article className="group cursor-pointer border-b border-gray-200 pb-3">
                <h3 className="font-serif text-[15px] font-bold leading-snug group-hover:underline text-black">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.excerpt}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {item.time}
                  {item.category && (
                    <> <span className="mx-1">|</span> <span className="text-black font-semibold">{item.category}</span></>
                  )}
                </p>
              </article>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
