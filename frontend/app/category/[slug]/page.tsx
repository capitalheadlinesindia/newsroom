import { client, urlFor } from "@/app/lib/sanity"
import { categoryArticlesQuery } from "@/app/lib/queries"
import Link from "next/link"
import Image from "next/image"

const PLACEHOLDER = "https://placehold.co/600x400/e5e7eb/9ca3af?text=No+Image"

export default async function CategoryPage({ params }: any) {
  const { slug } = await params
  const articles = await client.fetch(categoryArticlesQuery, { slug })

  // Derive display title from first article's category, or fall back to slug
  const categoryTitle =
    articles[0]?.categories?.find((c: any) => c.slug?.current === slug)?.title ||
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")

  return (
    <main className="max-w-screen-xl mx-auto py-10 px-4">
      <div className="border-b-4 border-black pb-3 mb-8">
        <h1 className="text-3xl font-serif font-bold capitalize">{categoryTitle}</h1>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {articles.map((a: any) => {
          const imageUrl = a.mainImage
            ? urlFor(a.mainImage).width(1600).height(400).quality(90).auto("format").url()
            : PLACEHOLDER
          const title = a.title || a.titleHindi || ""
          const excerpt = a.excerpt || a.excerptHindi || ""

          return (
            <Link key={a._id} href={`/article/${a.slug.current}`}>
              <div className="group flex flex-col gap-3 hover:opacity-90 transition">
                {/* Thumbnail */}
                <div className="relative w-full aspect-[3/2] overflow-hidden bg-gray-100">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Text */}
                <div className="border-b pb-4">
                  <h2 className="font-serif text-lg font-bold leading-snug line-clamp-3 text-black">
                    {title}
                  </h2>
                  {excerpt && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{excerpt}</p>
                  )}
                  {a.publishedAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(a.publishedAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {articles.length === 0 && (
        <p className="text-gray-400 italic">No articles found in this category.</p>
      )}
    </main>
  )
}
