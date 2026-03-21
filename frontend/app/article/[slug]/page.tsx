import { client, urlFor } from "@/app/lib/sanity"
import { articleBySlug, relatedArticlesQuery } from "@/app/lib/queries"
import ArticleBodyToggle from "@/app/components/ArticleBodyToggle"
import Image from "next/image"
import Link from "next/link"

export default async function ArticlePage({ params }: any) {
  const { slug } = await params
  const article = await client.fetch(articleBySlug, { slug })

  if (!article) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-serif font-bold">Article not found</h1>
        <Link href="/" className="text-sm underline mt-4 inline-block">← Back to home</Link>
      </div>
    )
  }

  const primaryCategory = article.categories?.[0]

  const related = primaryCategory?.slug?.current
    ? await client.fetch(relatedArticlesQuery, {
        category: primaryCategory.slug.current,
        slug,
      })
    : []

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""

  const wordCount = article.body
    ? article.body
        .filter((b: any) => b._type === "block")
        .flatMap((b: any) => b.children?.map((c: any) => c.text) ?? [])
        .join(" ")
        .split(/\s+/).length
    : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const imageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1200).url()
    : null

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── MAIN ARTICLE ─────────────────────────────── */}
          <article className="flex-1 min-w-0">

            {/* Breadcrumb — always English */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Link href="/" className="hover:underline">Home</Link>
              <span>›</span>
              {primaryCategory && (
                <>
                  <Link
                    href={`/category/${primaryCategory.slug?.current}`}
                    className="hover:underline text-[#bb1919] font-bold uppercase tracking-wide"
                  >
                    {primaryCategory.title}
                  </Link>
                  <span>›</span>
                </>
              )}
              <span className="truncate max-w-[200px]">{article.title}</span>
            </div>

            {/* All language-switchable content (title, excerpt, meta, image, body) */}
            <ArticleBodyToggle
              title={article.title}
              titleHindi={article.titleHindi ?? null}
              excerpt={article.excerpt ?? null}
              excerptHindi={article.excerptHindi ?? null}
              body={article.body}
              bodyHindi={article.bodyHindi ?? null}
              primaryCategory={primaryCategory ?? null}
              imageUrl={imageUrl}
              heroYouTubeUrl={article.heroYouTubeUrl ?? null}
              imageAlt={article.mainImage?.alt || article.title}
              imageCaption={article.mainImage?.caption ?? null}
              mainImageRef={article.mainImage?.asset?._ref ?? null}
              authorName={article.author?.name ?? null}
              publishedDate={publishedDate}
              readingTime={readingTime}
            />

            {/* Tags / bottom share */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-3">
              {primaryCategory && (
                <Link
                  href={`/category/${primaryCategory.slug?.current}`}
                  className="border border-gray-300 text-xs px-3 py-1 font-semibold hover:bg-gray-100 transition"
                >
                  {primaryCategory.title}
                </Link>
              )}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">Share</span>
                <button className="w-7 h-7 rounded-full bg-[#1877f2] text-white text-xs flex items-center justify-center font-bold hover:opacity-80">f</button>
                <button className="w-7 h-7 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold hover:opacity-80">𝕏</button>
                <button className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center hover:opacity-80">✉</button>
              </div>
            </div>

          </article>

          {/* ── SIDEBAR ──────────────────────────────────── */}
          <aside className="w-full lg:w-80 flex-shrink-0">

            {/* Related articles */}
            {related.length > 0 && (
              <div className="lg:sticky lg:top-6">
                <div className="border-b-2 border-gray-900 pb-2 mb-4">
                  <h2 className="text-sm font-extrabold uppercase tracking-widest text-black">
                    More on this topic
                  </h2>
                </div>
                <div className="space-y-4">
                  {related.map((rel: any) => (
                    <Link href={`/article/${rel.slug.current}`} key={rel.slug.current}>
                      <div className="group flex gap-3 items-start border-b border-gray-200 pb-4 cursor-pointer">
                        {rel.mainImage && (
                          <div className="flex-shrink-0 w-20 h-14 overflow-hidden">
                            <Image
                              src={urlFor(rel.mainImage).width(200).url()}
                              alt={rel.title}
                              width={200}
                              height={130}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm font-bold leading-snug group-hover:underline text-black line-clamp-3">
                            {rel.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(rel.publishedAt).toLocaleDateString("en-GB", {
                              day: "numeric", month: "short", year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {primaryCategory && (
                  <Link
                    href={`/category/${primaryCategory.slug?.current}`}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition"
                  >
                    More {primaryCategory.title} ›
                  </Link>
                )}
              </div>
            )}

          </aside>

        </div>
      </div>
    </main>
  )
}