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
    <Link href={`/article/${article.slug.current}`}>
      <article className="group cursor-pointer border-b border-gray-200 pb-4 flex sm:flex-row flex-col gap-3 items-start">

        {imageUrl && (
          <div className="flex-shrink-0 w-full sm:w-24 h-40 sm:h-16 overflow-hidden">
            <Image
              src={imageUrl}
              alt={article.mainImage?.alt || ""}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {article.categories?.[0]?.title && (
            <p className="text-[11px] font-bold uppercase text-[#bb1919] mb-1 tracking-wide">
              {article.categories[0].title}
            </p>
          )}
          <h3 className="font-serif text-[15px] font-bold leading-snug group-hover:underline text-black">
            {article.title}
          </h3>
        </div>

      </article>
    </Link>
  )
}
