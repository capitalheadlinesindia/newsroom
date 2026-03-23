import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/app/lib/sanity"

function resolveUrl(image: any, width = 1600): string | null {
  if (!image) return null
  if (typeof image === "string") return image
  return urlFor(image).width(width).quality(90).auto("format").url()
}

export default function ArticleCard({ article }: any) {
  const imageUrl = resolveUrl(article.mainImage)
  return (
    <Link
      href={`/article/${article.slug.current}`}
      className="block no-underline hover:no-underline focus:no-underline"
    >
      <article className="group cursor-pointer border-b border-gray-200 py-4 first:pt-2 flex flex-row gap-3 items-start">

        {imageUrl && (
          <div className="shrink-0 w-28 h-20 sm:w-24 sm:h-16 overflow-hidden mt-1">
            <Image
              src={imageUrl}
              alt={article.mainImage?.alt || article.title || "Article image"}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-[16px] sm:text-[15px] font-bold leading-snug text-black line-clamp-4 sm:line-clamp-3 group-hover:underline">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-1 text-[13px] leading-snug text-gray-600 line-clamp-2">
              {article.excerpt}
            </p>
          )}
        </div>

      </article>
    </Link>
  )
}
