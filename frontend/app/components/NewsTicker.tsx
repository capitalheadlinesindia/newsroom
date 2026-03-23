type NewsTickerProps = {
  items: string[]
  enabled: boolean
}

export default function NewsTicker({ items, enabled }: NewsTickerProps) {
  if (!enabled || items.length === 0) return null

  // Repeat items to create seamless loop effect
  const repeatedItems = [...items, ...items, ...items]

  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-[#bb1919] whitespace-nowrap">
          Latest
        </span>
        <div className="news-ticker-wrap">
          <div className="news-ticker-track">
            {repeatedItems.map((text, idx) => (
              <span key={idx} className="news-ticker-item">
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
