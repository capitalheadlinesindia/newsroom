import { client, urlFor } from "@/app/lib/sanity"
import { articleBySlug, relatedArticlesQuery } from "@/app/lib/queries"
import { PortableText } from "@portabletext/react"
import Image from "next/image"
import Link from "next/link"

export default async function ArticlePage({ params }: any) {
  const article = await client.fetch(articleBySlug, { slug: params.slug })

  if (!article) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-serif font-bold">Article not found</h1>
        <Link href="/" className="text-sm underline mt-4 inline-block">← Back to home</Link>
      </div>
    )
  }

  const related = article.category?.slug?.current
    ? await client.fetch(relatedArticlesQuery, {
        category: article.category.slug.current,
        slug: params.slug,
      })
    : []

  const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const wordCount = article.body
    ? article.body
        .filter((b: any) => b._type === "block")
        .flatMap((b: any) => b.children?.map((c: any) => c.text) ?? [])
        .join(" ")
        .split(/\s+/).length
    : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── MAIN ARTICLE ─────────────────────────────── */}
          <article className="flex-1 min-w-0">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Link href="/" className="hover:underline">Home</Link>
              <span>›</span>
              {article.category && (
                <>
                  <Link
                    href={`/category/${article.category.slug?.current}`}
                    className="hover:underline text-[#bb1919] font-bold uppercase tracking-wide"
                  >
                    {article.category.title}
                  </Link>
                  <span>›</span>
                </>
              )}
              <span className="truncate max-w-[200px]">{article.title}</span>
            </div>

            {/* Category label */}
            {article.category && (
              <Link href={`/category/${article.category.slug?.current}`}>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#bb1919] mb-3">
                  {article.category.title}
                </span>
              </Link>
            )}

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-black mb-4">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed mb-6 border-l-4 border-gray-900 pl-4">
                {article.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
              {article.author?.name && (
                <span>
                  By{" "}
                  <span className="font-bold text-black">{article.author.name}</span>
                </span>
              )}
              <span className="w-px h-4 bg-gray-300" />
              <time>{publishedDate}</time>
              <span className="w-px h-4 bg-gray-300" />
              <span>{readingTime} min read</span>

              {/* Share buttons */}
              <div className="ml-auto flex items-center gap-2">
                <button className="w-8 h-8 rounded-full bg-[#1877f2] text-white text-xs flex items-center justify-center font-bold hover:opacity-80">f</button>
                <button className="w-8 h-8 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold hover:opacity-80">𝕏</button>
                <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center hover:opacity-80">✉</button>
              </div>
            </div>

            {/* Hero image */}
            {article.mainImage && (
              <div className="mb-8">
                <Image
                  src={urlFor(article.mainImage).width(1200).url()}
                  alt={article.mainImage?.alt || article.title}
                  width={1200}
                  height={675}
                  className="w-full object-cover"
                  priority
                />
                {article.mainImage?.caption && (
                  <p className="text-xs text-gray-500 mt-2">{article.mainImage.caption}</p>
                )}
              </div>
            )}

            {/* Body */}
            {article.body && (
              <div className="article-body max-w-2xl">
                <PortableText value={article.body} />
              </div>
            )}

            {/* Tags / bottom share */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-3">
              {article.category && (
                <Link
                  href={`/category/${article.category.slug?.current}`}
                  className="border border-gray-300 text-xs px-3 py-1 font-semibold hover:bg-gray-100 transition"
                >
                  {article.category.title}
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

                {/* Back to category */}
                {article.category && (
                  <Link
                    href={`/category/${article.category.slug?.current}`}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition"
                  >
                    More {article.category.title} ›
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

