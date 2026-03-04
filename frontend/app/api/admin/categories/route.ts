import { createClient } from "@sanity/client"
import { NextResponse } from "next/server"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: false,
})

export async function GET() {
  try {
    const cats = await client.fetch(
      `*[_type == "category"] | order(title asc){ "slug": slug.current, title }`
    )
    return NextResponse.json(cats)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
