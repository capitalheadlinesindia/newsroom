import {
  fetchPlacements,
  toHeroArticle,
  toFeaturedArticles,
  toSidebarArticles,
  toFourGridItems as placementToGrid,
} from "@/app/lib/placements"
import { client, urlFor } from "@/app/lib/sanity"
import { articlesByCategoryQuery, allCategoryArticlesQuery } from "@/app/lib/queries"

import HeroArticle from "@/app/components/HeroArticle"
import ArticleCard from "@/app/components/ArticleCard"
import SidebarItem from "@/app/components/SidebarItem"
import SectionHeader from "@/app/components/SectionHeader"
import FourGrid from "@/app/components/FourGrid"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
const PLACEHOLDER = "https://placehold.co/400x250/e5e7eb/9ca3af?text=No+Image"

// Default display labels — shown only if admin hasn't renamed the section yet
const DEFAULT_SECTION_LABELS: Record<string, string> = {
  newsroom:        "From the Newsroom",
  winterOlympics:  "Winter Olympics",
  technology:      "Technology",
  moreNews_left:   "More News – Left",
  moreNews_center: "More News – Center",
  moreNews_right:  "More News – Right",
  mustWatch:       "Must Watch",
}

// Ordered list of section keys to render as grids (hero/featured/sidebar handled separately)
const GRID_SECTION_KEYS = [
  "newsroom",
  "winterOlympics",
  "technology",
  "moreNews_left",
  "moreNews_center",
  "moreNews_right",
  "mustWatch",
]

async function fetchSectionLabels(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${BACKEND}/api/section-labels`, { cache: "no-store" })
    if (!res.ok) return {}
    return res.json()
  } catch {
    return {}
  }
}

interface HomepageSection {
  _id: string
  label: string
  categorySlug: string
  maxArticles: number
}

interface CategoryItem {
  slug: string
  title: string
}

async function fetchHomepageSections(): Promise<HomepageSection[]> {
  try {
    const res = await fetch(`${BACKEND}/api/homepage-sections`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function fetchVisibleCategories(): Promise<CategoryItem[]> {
  try {
    const res = await fetch(`${BACKEND}/api/categories`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

// Resolve title: prefer English, fall back to Hindi
function resolveTitle(a: any): string {
  return (a.title?.trim() || a.titleHindi?.trim() || "")
}

// Resolve excerpt: prefer English, fall back to Hindi
function resolveExcerpt(a: any): string {
  return (a.excerpt?.trim() || a.excerptHindi?.trim() || "")
}

function toFourGridItems(articles: any[]) {
  return articles
    .map((a: any) => ({
      slug: `/article/${a.slug?.current ?? a.slug}`,
      image: a.mainImage
        ? urlFor(a.mainImage).width(1600).quality(90).auto("format").url()
        : PLACEHOLDER,
      title: resolveTitle(a),
      excerpt: resolveExcerpt(a),
      category: a.categories?.[0]?.title ?? "",
    }))
    .filter((a) => a.title) // skip articles with no title at all
}

export default async function HomePage() {
  // Fetch placements (hero / featured / sidebar)
  const placements = await fetchPlacements()
  const hero     = toHeroArticle(placements["hero"] || [])
  const featured = toFeaturedArticles(placements["featured"] || [])
  const sidebar  = toSidebarArticles(placements["sidebar"] || [])

  // Fetch admin-customised section labels (overrides defaults)
  const backendLabels = await fetchSectionLabels()
  const resolvedLabels = { ...DEFAULT_SECTION_LABELS, ...backendLabels }

  // Fetch admin-defined homepage sections. Only render sections explicitly
  // configured by the admin; do NOT auto-fall back to Sanity or visible
  // categories so the homepage shows only manually chosen sections.
  const configuredSections = await fetchHomepageSections()

  const effectiveSections: HomepageSection[] = configuredSections
  const sectionArticles: any[][] = effectiveSections.length
    ? await Promise.all(
        effectiveSections.map((sec) =>
          client.fetch(articlesByCategoryQuery, {
            categorySlug: sec.categorySlug,
            limit: sec.maxArticles,
          })
        )
      )
    : []

  return (
    <main className="bg-white">

      {/* ── TOP NEWS ───────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <SectionHeader title="Top News" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* LEFT — Featured cards */}
          <section className="md:col-span-3 space-y-0 md:border-r md:border-gray-200 md:pr-6">
            {featured?.map((article: any) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </section>

          {/* CENTER — Hero */}
          <section className="md:col-span-6 md:border-r md:border-gray-200 md:pr-6">
            {hero && <HeroArticle article={hero} />}
          </section>

          {/* RIGHT — Sidebar */}
          <aside className="md:col-span-3 space-y-0">
            {sidebar?.map((article: any) => (
              <SidebarItem
                key={article.slug.current}
                article={article}
              />
            ))}
          </aside>

        </div>
      </div>

      {/* ── PLACEMENT-BASED SECTIONS (newsroom / politics / technology …) ─ */}
      {GRID_SECTION_KEYS.map((key) => {
        const items = placements[key] ? placementToGrid(placements[key]) : []
        if (items.length === 0) return null
        return (
          <div key={key}>
            <hr className="border-gray-200 max-w-screen-xl mx-auto" />
            <FourGrid title={resolvedLabels[key] || key} items={items} />
          </div>
        )
      })}

      {/* ── DYNAMIC CATEGORY SECTIONS (admin Homepage Layout tab) ────────── */}
      {effectiveSections.map((sec, idx) => {
        const items = toFourGridItems(sectionArticles[idx] || [])
        return (
          <div key={sec._id}>
            <hr className="border-gray-200 max-w-screen-xl mx-auto" />
            <FourGrid title={sec.label} items={items} />
          </div>
        )
      })}

      {/* ── BOTTOM PADDING ────────────────────────────── */}
      <div className="h-12" />

    </main>
  )
}
