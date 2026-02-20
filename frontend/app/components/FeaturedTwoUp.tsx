import Image from "next/image"
import Link from "next/link"
import SectionHeader from "./SectionHeader"

const stories = [
  {
    slug: "/article/historic-us-home-super-rich",
    image: "https://picsum.photos/seed/f1/800/500",
    title: "The historic US home that embodied the super-rich",
    excerpt:
      "The largest privately owned home in the US, Biltmore House was an \"American chateau built on the scale of a European palace\". It reveals much about the dreams of the US's one per cent.",
  },
  {
    slug: "#",
    image: "https://picsum.photos/seed/f2/800/500",
    title: "Extreme ways countries are combatting overtourism",
    excerpt:
      "As global travel surges toward 1.8 billion arrivals, destinations are testing controversial new measures to control the crowds.",
  },
]

export default function FeaturedTwoUp({ title }: { title: string }) {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <SectionHeader title={title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stories.map((s) => (
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
