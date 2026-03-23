import Link from "next/link"
import Image from "next/image"
import { urlFor } from "@/app/lib/sanity"

function resolveUrl(image: any, width = 80): string | null {
  if (!image) return null
  if (typeof image === "string") return image
  return urlFor(image).width(width).url()
}

function timeAgo(dateString: string) {
  if (!dateString) return null
  const now = new Date()
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return null
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60 / 60)

  if (diff < 1) return "Less than 1 hr ago"
  if (diff === 1) return "1 hr ago"
  if (diff < 24) return `${diff} hrs ago`

  const days = Math.floor(diff / 24)
  return `${days} day${days > 1 ? "s" : ""} ago`
}

export default function SidebarItem({ article }: any) {
  const relativeTime = timeAgo(article.publishedAt)

  return (
    <Link href={`/article/${article.slug.current}`}>
      <div className="group border-b border-gray-200 pt-4 pb-4 first:pt-3 cursor-pointer">

        {article.categories?.[0] && (
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-gray-400" />
            <p className="text-[11px] font-bold uppercase text-[#bb1919] tracking-wide leading-none">
              {article.categories[0].title}
            </p>
          </div>
        )}

        <div>

          <h4 className="font-serif text-[15px] font-bold leading-snug group-hover:underline text-black">
            {article.title}
          </h4>

          {relativeTime && (
            <p className="text-xs text-gray-500 mt-1">
              {relativeTime}
            </p>
          )}
        </div>

      </div>
    </Link>
  )
}
