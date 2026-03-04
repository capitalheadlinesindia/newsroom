import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/app/lib/sanity"

function resolveUrl(image: any, width = 2400): string | null {
  if (!image) return null
  if (typeof image === "string") return image
  return urlFor(image).width(width).auto('format').url()
}

export default function HeroArticle({ article }: any) {
  if (!article) return null

  const imageUrl = resolveUrl(article.mainImage || article.image)

  return (
    <Link href={`/article/${article.slug?.current ?? article.slug}`}>
      <article className="space-y-3 cursor-pointer">

        <h2 className="text-3xl font-serif font-bold leading-tight hover:underline">
          {article.title}
        </h2>

        {imageUrl && (
          <div className="relative w-full h-[360px] overflow-hidden">
            <Image
              src={imageUrl}
              alt={article.mainImage?.alt || article.image?.alt || article.title || ""}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        )}

        {article.excerpt && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {article.excerpt}
          </p>
        )}

      </article>
    </Link>
  )
}
