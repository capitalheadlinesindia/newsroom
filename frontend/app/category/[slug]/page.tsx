import { client } from "@/app/lib/sanity"
import { categoryArticlesQuery } from "@/app/lib/queries"
import Link from "next/link"

export default async function CategoryPage({ params }: any) {
  const articles = await client.fetch(categoryArticlesQuery, {
    slug: params.slug,
  })

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-serif font-bold mb-8 capitalize">
        {params.slug}
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {articles.map((a: any) => (
          <Link key={a._id} href={`/article/${a.slug.current}`}>
            <div className="border-b pb-4 hover:opacity-80">
              <h2 className="font-serif text-xl font-semibold">
                {a.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {a.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
