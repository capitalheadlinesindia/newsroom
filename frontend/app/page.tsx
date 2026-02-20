import { client } from "@/app/lib/sanity"
import {
  heroQuery,
  featuredQuery,
  sidebarQuery,
} from "@/app/lib/queries"

import HeroArticle from "@/app/components/HeroArticle"
import ArticleCard from "@/app/components/ArticleCard"
import SidebarItem from "@/app/components/SidebarItem"
import SectionHeader from "@/app/components/SectionHeader"
import FeaturedTwoUp from "@/app/components/FeaturedTwoUp"
import FourGrid from "@/app/components/FourGrid"
import MoreNewsSection from "@/app/components/MoreNewsSection"
import MustWatch from "@/app/components/MustWatch"
import FeatureStory from "@/app/components/FeatureStory"

const winterOlympicsItems = [
  {
    slug: "#",
    image: "https://picsum.photos/seed/wo1/400/250",
    live: true,
    title: "Winter Olympics: Updates from day 13",
    excerpt: "Follow all the action from the Winter Olympics in Milan-Cortina.",
  },
  {
    slug: "#",
    image: "https://picsum.photos/seed/wo2/400/250",
    title: "Gaffe-ridden Olympic commentary prompts Italy's Rai sport chief to resign",
    excerpt:
      "Paolo Petrecca, whose gaffe-ridden commentary of the event went viral, stands down from his job.",
  },
  {
    slug: "#",
    image: "https://picsum.photos/seed/wo3/400/250",
    title: "What is ski mountaineering?",
    excerpt:
      "BBC Sport's Ask Me Anything team explains what ski mountaineering is ahead of its debut at the 2026 Winter Olympics",
  },
  {
    slug: "#",
    image: "https://picsum.photos/seed/wo4/400/250",
    title: "GB aim for curling semis & Atkin starts halfpipe medal bid – Thursday's guide",
    excerpt:
      "What's happening and who to look out for at the 2026 Winter Olympics in Milan-Cortina.",
  },
]

const techItems = [
  {
    slug: "#",
    image: "https://picsum.photos/seed/t1/400/250",
    title: "OpenAI launches new reasoning model that surprises researchers",
    excerpt: "The latest model scores record highs on academic benchmarks, raising new questions about AI safety.",
    category: "AI",
  },
  {
    slug: "#",
    image: "https://picsum.photos/seed/t2/400/250",
    title: "Apple's mixed-reality headset sales disappoint in first year",
    excerpt: "Analysts say the high price point and lack of killer apps have slowed consumer adoption.",
    category: "Tech",
  },
  {
    slug: "#",
    image: "https://picsum.photos/seed/t3/400/250",
    title: "EU slaps record fine on social media giant over data misuse",
    excerpt: "Regulators say the platform failed to protect users from targeted political advertising.",
    category: "Europe",
  },
  {
    slug: "#",
    image: "https://picsum.photos/seed/t4/400/250",
    title: "Quantum computing breakthrough could crack today's encryption",
    excerpt: "Scientists say a new qubit architecture brings practical quantum computing much closer to reality.",
    category: "Science",
  },
]

export default async function HomePage() {
  const hero = await client.fetch(heroQuery)
  const featured = await client.fetch(featuredQuery)
  const sidebar = await client.fetch(sidebarQuery)

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

      <hr className="border-gray-200 max-w-screen-xl mx-auto" />

      {/* ── ONLY FROM THE NEWSROOM ─────────────────────── */}
      <FeaturedTwoUp title="Only from the Newsroom" />

      <hr className="border-gray-200 max-w-screen-xl mx-auto" />

      {/* ── WINTER OLYMPICS ───────────────────────────── */}
      <FourGrid title="Winter Olympics" items={winterOlympicsItems} />

      <hr className="border-gray-200 max-w-screen-xl mx-auto" />

      {/* ── MORE NEWS ─────────────────────────────────── */}
      <MoreNewsSection title="More News" />

      <hr className="border-gray-200 max-w-screen-xl mx-auto" />

      {/* ── MUST WATCH (dark) ─────────────────────────── */}
      <MustWatch />

      {/* ── SCIENCE FEATURE ───────────────────────────── */}
      <hr className="border-gray-200 max-w-screen-xl mx-auto" />
      <FeatureStory
        title="Science"
        image="https://picsum.photos/seed/sci1/900/550"
        headline="The toddlers saving an endangered Sámi language"
        excerpt="Special nurseries are helping the Sámi people in Finland to bring their almost-lost language back from the brink of extinction."
        slug="#"
        ctaLabel="See more"
      />

      <hr className="border-gray-200 max-w-screen-xl mx-auto" />

      {/* ── TECHNOLOGY ────────────────────────────────── */}
      <FourGrid title="Technology" items={techItems} />

      <hr className="border-gray-200 max-w-screen-xl mx-auto" />

      {/* ── TRAVEL FEATURE ────────────────────────────── */}
      <FeatureStory
        title="Travel"
        image="https://picsum.photos/seed/tr1/900/550"
        headline="The island nations racing to relocate before the seas rise"
        excerpt="From the Maldives to Tuvalu, small island states are drawing up radical plans to move entire populations as climate change accelerates."
        slug="#"
        ctaLabel="Explore"
      />

      <hr className="border-gray-200 max-w-screen-xl mx-auto" />

      {/* ── BOTTOM PADDING ────────────────────────────── */}
      <div className="h-12" />

    </main>
  )
}
