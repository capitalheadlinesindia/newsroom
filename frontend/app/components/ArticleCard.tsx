import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/app/lib/sanity"

export default function ArticleCard({ article }: any) {
  return (
    <Link href={`/article/${article.slug.current}`}>
      <article className="group cursor-pointer border-b border-gray-200 pb-4 flex sm:flex-row flex-col gap-3 items-start">

        {article.mainImage && (
          <div className="flex-shrink-0 w-full sm:w-24 h-40 sm:h-16 overflow-hidden">
            <Image
              src={urlFor(article.mainImage).width(300).url()}
              alt={article.mainImage?.alt || ""}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {article.category?.title && (
            <p className="text-[11px] font-bold uppercase text-[#bb1919] mb-1 tracking-wide">
              {article.category.title}
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
