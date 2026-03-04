import { NextResponse } from "next/server"
import { createClient } from "@sanity/client"
import { createImageUrlBuilder } from "@sanity/image-url"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
})

const builder = createImageUrlBuilder(client)

function urlFor(source: any): string {
  try {
    return builder.image(source).width(1600).quality(90).auto('format').url()
  } catch {
    return ""
  }
}

const ALL_ARTICLES_QUERY = `
*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  titleHindi,
  "slug": slug.current,
  excerpt,
  mainImage,
  "category": categories[0]->title,
  publishedAt
}
`

export async function GET() {
  try {
    const articles = await client.fetch(ALL_ARTICLES_QUERY)

    const formatted = articles.map((a: any) => ({
      _id: a._id,
      title: a.title || a.titleHindi || "",
      slug: a.slug || "",
      excerpt: a.excerpt || a.excerptHindi || "",
      image: a.mainImage ? urlFor(a.mainImage) : "",
      category: a.category || "",
      publishedAt: a.publishedAt,
    }))

    return NextResponse.json(formatted)
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch articles from Sanity", detail: err.message },
      { status: 500 }
    )
  }
}
