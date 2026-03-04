/**
 * Fetches article placement assignments from the Express backend.
 * Used by Next.js server components to override default Sanity ordering.
 */

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export interface PlacedArticle {
  section: string
  order: number
  articleId: string
  articleTitle: string
  articleSlug: string
  articleImage: string
  articleExcerpt: string
  articleCategory: string
}

type PlacementsMap = Record<string, PlacedArticle[]>

/**
 * Fetch all placements grouped by section.
 * Returns an empty object if the backend is unreachable.
 */
export async function fetchPlacements(): Promise<PlacementsMap> {
  try {
    const res = await fetch(`${BACKEND}/api/placements`, {
      next: { revalidate: 30 }, // revalidate every 30 seconds
    })
    if (!res.ok) return {}
    return res.json()
  } catch {
    return {}
  }
}

/**
 * Convert a section's PlacedArticles into the minimal shape expected
 * by FourGrid, MoreNewsSection, etc.
 */
export function toFourGridItems(placed: PlacedArticle[]) {
  return placed.map((p) => ({
    slug: `/article/${p.articleSlug}`,
    image: p.articleImage || "/placeholder.jpg",
    title: p.articleTitle,
    excerpt: p.articleExcerpt,
    category: p.articleCategory,
  }))
}

export function toTwoUpItems(placed: PlacedArticle[]) {
  return placed.map((p) => ({
    slug: `/article/${p.articleSlug}`,
    image: p.articleImage || "/placeholder.jpg",
    title: p.articleTitle,
    excerpt: p.articleExcerpt,
  }))
}

export function toMoreNewsItems(placed: PlacedArticle[]) {
  return placed.map((p) => ({
    slug: `/article/${p.articleSlug}`,
    image: p.articleImage || "/placeholder.jpg",
    title: p.articleTitle,
    excerpt: p.articleExcerpt,
    category: p.articleCategory,
    time: "",
  }))
}

export function toMustWatchItems(placed: PlacedArticle[]) {
  return placed.map((p) => ({
    slug: `/article/${p.articleSlug}`,
    image: p.articleImage || "/placeholder.jpg",
    title: p.articleTitle,
    excerpt: p.articleExcerpt,
    category: p.articleCategory,
  }))
}

/**
 * Convert the first hero placement into the shape HeroArticle expects.
 * mainImage is stored as a pre-built URL string.
 */
export function toHeroArticle(placed: PlacedArticle[] | undefined) {
  const p = placed?.[0]
  if (!p) return null
  return {
    _id: p.articleId,
    title: p.articleTitle,
    slug: { current: p.articleSlug },
    mainImage: p.articleImage || null,
    excerpt: p.articleExcerpt,
    categories: p.articleCategory ? [{ title: p.articleCategory }] : [],
  }
}

/**
 * Convert featured placements into the shape ArticleCard expects.
 * mainImage is stored as a pre-built URL string.
 */
export function toFeaturedArticles(placed: PlacedArticle[]) {
  return placed.map((p) => ({
    _id: p.articleId,
    title: p.articleTitle,
    slug: { current: p.articleSlug },
    mainImage: p.articleImage || null,
    categories: p.articleCategory ? [{ title: p.articleCategory }] : [],
  }))
}

/**
 * Convert sidebar placements into the shape SidebarItem expects.
 */
export function toSidebarArticles(placed: PlacedArticle[]) {
  return placed.map((p) => ({
    _id: p.articleId,
    title: p.articleTitle,
    slug: { current: p.articleSlug },
    mainImage: p.articleImage || null,
    categories: p.articleCategory ? [{ title: p.articleCategory }] : [],
    publishedAt: "",
  }))
}
