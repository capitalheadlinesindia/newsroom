import Image from "next/image"
import Link from "next/link"
import SectionHeader from "./SectionHeader"

type FourGridProps = {
  title: string
  items: {
    slug: string
    image: string
    live?: boolean
    title: string
    excerpt: string
    category?: string
  }[]
}

export default function FourGrid({ title, items }: FourGridProps) {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <SectionHeader title={title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => (
          <Link href={item.slug} key={item.title}>
            <article className="group cursor-pointer">
              <div className="overflow-hidden relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={250}
                  className="w-full h-44 object-cover group-hover:opacity-95 transition"
                />
              </div>

              {item.live ? (
                <p className="flex items-center gap-1 mt-2 text-[#bb1919] text-xs font-bold uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#bb1919] inline-block animate-pulse" />
                  LIVE {item.title}
                </p>
              ) : (
                <h3 className="font-serif text-[15px] font-bold leading-snug mt-2 group-hover:underline text-black">
                  {item.title}
                </h3>
              )}

              <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-3">
                {item.excerpt}
              </p>

              {item.category && (
                <p className="text-xs text-[#bb1919] font-bold uppercase mt-2 tracking-wide">
                  {item.category}
                </p>
              )}
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
