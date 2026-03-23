import Image from "next/image"
import Link from "next/link"
import SectionHeader from "./SectionHeader"

type CarouselItem = {
  slug: string
  image: string
  title: string
  excerpt: string
  category?: string
}

type HorizontalCarouselSectionProps = {
  title: string
  items: CarouselItem[]
}

export default function HorizontalCarouselSection({ title, items }: HorizontalCarouselSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <SectionHeader title={title} />
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 italic py-4">No articles in this section yet.</p>
      ) : (
        <div className="-mx-1 overflow-x-auto pb-2">
          <div className="flex min-w-max gap-4 px-1">
            {items.map((item) => (
              <Link href={item.slug} key={`${item.slug}-${item.title}`} className="w-72 shrink-0">
                <article className="group cursor-pointer">
                  <div className="overflow-hidden relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={800}
                      height={500}
                      sizes="288px"
                      className="w-full h-40 object-cover group-hover:opacity-95 transition"
                    />
                  </div>

                  <h3 className="font-serif text-[18px] font-bold leading-snug mt-2 group-hover:underline text-black line-clamp-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-2">
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
        </div>
      )}
    </section>
  )
}
