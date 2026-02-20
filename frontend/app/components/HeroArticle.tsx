import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/app/lib/sanity"

export default function HeroArticle({ article }: any) {
  if (!article) return null

  return (
    <Link href={`/article/${article.slug.current}`}>
      <article className="group cursor-pointer">

        {/* LIVE badge */}
        {article.isLive && (
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-[#bb1919] inline-block animate-pulse"></span>
            <span className="text-[#bb1919] font-bold text-sm tracking-widest uppercase">Live</span>
          </div>
        )}

        <h2 className="text-3xl lg:text-4xl font-serif font-bold leading-tight group-hover:underline text-black mb-4">
          {article.title}
        </h2>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <Image
            src={urlFor(article.mainImage).width(700).url()}
            alt={article.mainImage?.alt || ""}
            width={700}
            height={450}
            className="w-full h-52 object-cover"
          />
          {article.secondaryImage ? (
            <Image
              src={urlFor(article.secondaryImage).width(700).url()}
              alt={article.secondaryImage?.alt || ""}
              width={700}
              height={450}
              className="w-full h-52 object-cover"
            />
          ) : (
            <Image
              src={urlFor(article.mainImage).width(700).url()}
              alt={article.mainImage?.alt || ""}
              width={700}
              height={450}
              className="w-full h-52 object-cover brightness-75"
            />
          )}
        </div>

        {article.excerpt && (
          <p className="text-sm text-gray-700 leading-relaxed">
            {article.excerpt}
          </p>
        )}

      </article>
    </Link>
  )
}
