export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-900 pb-2 mb-5">
      <h2 className="text-sm font-extrabold uppercase tracking-widest text-black">
        {title}
      </h2>
      <span className="text-black font-bold text-sm">›</span>
    </div>
  )
}
