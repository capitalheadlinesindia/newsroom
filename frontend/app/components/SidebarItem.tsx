import Link from "next/link"

function timeAgo(dateString: string) {
  const now = new Date()
  const date = new Date(dateString)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60 / 60)

  if (diff < 1) return "Less than 1 hr ago"
  if (diff === 1) return "1 hr ago"
  if (diff < 24) return `${diff} hrs ago`

  const days = Math.floor(diff / 24)
  return `${days} day${days > 1 ? "s" : ""} ago`
}

export default function SidebarItem({ article }: any) {
  return (
    <Link href={`/article/${article.slug.current}`}>
      <div className="group border-b border-gray-200 pb-4 cursor-pointer flex items-start gap-2">

        {/* Bullet */}
        <span className="mt-[6px] w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>

        <div>
          {article.category && (
            <p className="text-[11px] font-bold uppercase text-[#bb1919] mb-[2px] tracking-wide">
              {article.category.title}
            </p>
          )}

          <h4 className="font-serif text-[15px] font-bold leading-snug group-hover:underline text-black">
            {article.title}
          </h4>

          <p className="text-xs text-gray-500 mt-1">
            {timeAgo(article.publishedAt)}
          </p>
        </div>

      </div>
    </Link>
  )
}
