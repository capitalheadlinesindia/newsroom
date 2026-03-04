import Image from "next/image"
import Link from "next/link"
import SectionHeader from "./SectionHeader"

type NewsItem = { slug: string; image?: string; title: string; excerpt: string; category?: string; time?: string }

export default function MoreNewsSection({
  title,
  left = [],
  center = null,
  right = [],
}: {
  title: string
  left?: NewsItem[]
  center?: NewsItem | null
  right?: NewsItem[]
}) {
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
        {center && (
          <Link href={center.slug}>
            <article className="group cursor-pointer md:border-r md:border-gray-200 md:pr-6">
              {center.image && (
                <Image
                  src={center.image}
                  alt={center.title}
                  width={800}
                  height={600}
                  className="w-full h-72 object-cover"
                />
              )}
              <h3 className="font-serif text-xl font-bold leading-snug mt-3 group-hover:underline text-black">
                {center.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{center.excerpt}</p>
              {center.category && (
                <p className="text-xs text-gray-400 mt-2">
                  <span className="text-black font-semibold">{center.category}</span>
                </p>
              )}
            </article>
          </Link>
        )}

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