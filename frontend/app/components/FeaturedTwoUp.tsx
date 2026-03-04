import Image from "next/image"
import Link from "next/link"
import SectionHeader from "./SectionHeader"

type Story = { slug: string; image: string; title: string; excerpt: string }

export default function FeaturedTwoUp({ title, items = [] }: { title: string; items?: Story[] }) {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <SectionHeader title={title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((s) => (
          <Link href={s.slug} key={s.title}>
            <article className="group cursor-pointer">
              <div className="overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  width={800}
                  height={500}
                  className="w-full h-64 sm:h-72 object-cover group-hover:opacity-95 transition"
                />
              </div>
              <h3 className="font-serif text-xl font-bold leading-snug mt-3 group-hover:underline text-black">
                {s.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {s.excerpt}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
