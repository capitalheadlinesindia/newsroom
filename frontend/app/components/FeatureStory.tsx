import Image from "next/image"
import Link from "next/link"
import SectionHeader from "./SectionHeader"

type FeatureStoryProps = {
  title: string
  image: string
  headline: string
  excerpt: string
  slug: string
  ctaLabel?: string
}

export default function FeatureStory({
  title,
  image,
  headline,
  excerpt,
  slug,
  ctaLabel = "See more",
}: FeatureStoryProps) {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <SectionHeader title={title} />
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <Link href={slug} className="w-full md:w-2/3">
          <Image
            src={image}
            alt={headline}
            width={900}
            height={550}
            className="w-full h-72 sm:h-96 object-cover"
          />
        </Link>
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <Link href={slug}>
            <h3 className="font-serif text-2xl font-bold leading-snug text-black hover:underline">
              {headline}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 leading-relaxed">{excerpt}</p>
          <Link href={slug}>
            <button className="border border-black text-black text-sm font-bold px-5 py-2 hover:bg-black hover:text-white transition self-start">
              {ctaLabel}
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
