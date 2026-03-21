"use client"
import { useState } from "react"
import { PortableText } from "@portabletext/react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/app/lib/sanity"

interface Props {
  // English fields (required)
  title: string
  excerpt?: string | null
  body: any[]
  // Hindi fields (all optional)
  titleHindi?: string | null
  excerptHindi?: string | null
  bodyHindi?: any[] | null
  // Category for label
  primaryCategory?: { title: string; slug?: { current: string } } | null
  // Image (pre-resolved URL from server)
  imageUrl?: string | null
  heroYouTubeUrl?: string | null
  imageAlt?: string
  imageCaption?: string | null
  // Asset ref of the hero image — body blocks matching this ref will be skipped
  mainImageRef?: string | null
  // Meta (always English)
  authorName?: string | null
  publishedDate?: string
  readingTime?: number
}

export default function ArticleBodyToggle({
  title,
  excerpt,
  body,
  titleHindi,
  excerptHindi,
  bodyHindi,
  primaryCategory,
  imageUrl,
  heroYouTubeUrl,
  imageAlt,
  imageCaption,
  mainImageRef,
  authorName,
  publishedDate,
  readingTime,
}: Props) {
  function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
    if (!url) return null
    try {
      const u = new URL(url)
      const host = u.hostname.replace(/^www\./, "")
      if (host === "youtu.be") {
        const id = u.pathname.slice(1)
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      if (host.includes("youtube.com")) {
        if (u.pathname === "/watch") {
          const id = u.searchParams.get("v")
          return id ? `https://www.youtube.com/embed/${id}` : null
        }
        if (u.pathname.startsWith("/shorts/")) {
          const id = u.pathname.split("/")[2]
          return id ? `https://www.youtube.com/embed/${id}` : null
        }
        if (u.pathname.startsWith("/embed/")) {
          const id = u.pathname.split("/")[2]
          return id ? `https://www.youtube.com/embed/${id}` : null
        }
      }
      return null
    } catch {
      return null
    }
  }

  // Custom PortableText components — render body images with Next/Image,
  // but skip the one that's already shown as the hero above.
  const ptComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null
        // skip if it's the same asset as the hero
        if (mainImageRef && value.asset._ref === mainImageRef) return null
        try {
          const src = urlFor(value).width(800).url()
          return (
            <div className="my-6">
              <Image
                src={src}
                alt={value.alt || ""}
                width={800}
                height={500}
                className="w-full object-cover"
              />
              {value.caption && (
                <p className="text-xs text-gray-500 mt-2">{value.caption}</p>
              )}
            </div>
          )
        } catch {
          return null
        }
      },
      youtubeEmbed: ({ value }: any) => {
        const embedUrl = getYouTubeEmbedUrl(value?.url)
        if (!embedUrl) return null
        return (
          <div className="my-6">
            <div className="relative w-full pt-[56.25%] overflow-hidden bg-black">
              <iframe
                src={embedUrl}
                title={value?.title || "YouTube video"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            {value?.title && (
              <p className="text-xs text-gray-500 mt-2">{value.title}</p>
            )}
          </div>
        )
      },
    },
  }
  const hasHindi =
    !!titleHindi ||
    !!excerptHindi ||
    (Array.isArray(bodyHindi) && bodyHindi.length > 0)

  const hasEnglish =
    !!(title && title.toString().trim()) ||
    !!(excerpt && excerpt.toString().trim()) ||
    (Array.isArray(body) && body.length > 0)

  // Default to Hindi if the article has only Hindi content (no English available)
  const initialLang: "en" | "hi" = !hasEnglish && hasHindi ? "hi" : "en"
  const [lang, setLang] = useState<"en" | "hi">(initialLang)

  const activeTitle = lang === "hi" && titleHindi ? titleHindi : title
  const activeExcerpt = lang === "hi" && excerptHindi ? excerptHindi : excerpt
  const activeBody =
    lang === "hi" && Array.isArray(bodyHindi) && bodyHindi.length > 0
      ? bodyHindi
      : body

  return (
    <>
      {/* ── Language toggle ──────────────────────────────── */}
      {/* Show toggle only when BOTH languages are available */}
      {hasHindi && hasEnglish && (
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Read in:
          </span>
          <div className="flex border border-gray-300 overflow-hidden text-sm font-semibold">
            <button
              onClick={() => setLang("en")}
              className={`px-4 py-1.5 transition ${
                lang === "en"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-4 py-1.5 transition ${
                lang === "hi"
                  ? "bg-[#bb1919] text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      )}

      {/* ── Category label ───────────────────────────────── */}
      {primaryCategory && (
        <Link href={`/category/${primaryCategory.slug?.current}`}>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#bb1919] mb-3">
            {primaryCategory.title}
          </span>
        </Link>
      )}

      {/* ── Title ────────────────────────────────────────── */}
      <h1
        lang={lang === "hi" ? "hi" : "en"}
        className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-black mb-4"
      >
        {activeTitle}
      </h1>

      {/* ── Excerpt ──────────────────────────────────────── */}
      {activeExcerpt && (
        <p
          lang={lang === "hi" ? "hi" : "en"}
          className="text-lg text-gray-600 leading-relaxed mb-6 border-l-4 border-gray-900 pl-4"
        >
          {activeExcerpt}
        </p>
      )}

      {/* ── Meta row ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
        {authorName && (
          <span>
            By <span className="font-bold text-black">{authorName}</span>
          </span>
        )}
        {authorName && <span className="w-px h-4 bg-gray-300" />}
        {publishedDate && <time>{publishedDate}</time>}
        {publishedDate && <span className="w-px h-4 bg-gray-300" />}
        {readingTime && <span>{readingTime} min read</span>}
        <div className="ml-auto flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-[#1877f2] text-white text-xs flex items-center justify-center font-bold hover:opacity-80">f</button>
          <button className="w-8 h-8 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold hover:opacity-80">𝕏</button>
          <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center hover:opacity-80">✉</button>
        </div>
      </div>

      {/* ── Hero media (YouTube takes priority over image) ───────────────── */}
      {getYouTubeEmbedUrl(heroYouTubeUrl) ? (
        <div className="mb-8">
          <div className="relative w-full pt-[56.25%] overflow-hidden bg-black">
            <iframe
              src={getYouTubeEmbedUrl(heroYouTubeUrl)!}
              title={title || titleHindi || "Article video"}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        imageUrl && (
          <div className="mb-8">
            <Image
              src={imageUrl}
              alt={imageAlt || title || titleHindi || "Article image"}
              width={1200}
              height={675}
              className="w-full object-cover"
              priority
            />
            {imageCaption && (
              <p className="text-xs text-gray-500 mt-2">{imageCaption}</p>
            )}
          </div>
        )
      )}

      {/* ── Body ─────────────────────────────────────────── */}
      <div
        className="article-body max-w-2xl"
        lang={lang === "hi" ? "hi" : "en"}
      >
        <PortableText value={activeBody} components={ptComponents} />
      </div>
    </>
  )
}
