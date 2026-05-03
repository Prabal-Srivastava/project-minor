const defaults = [
  "Welcome to propnews24 — Your source for latest updates",
  "Breaking: Market hits all-time high today",
  "Tech giants announce new AI partnerships",
  "Global climate summit reaches new agreement",
]

export default function BreakingNews({ news = [] }) {
  const headlines = news.length > 0 ? news.map((n) => n.title) : defaults
  const doubled = [...headlines, ...headlines]

  return (
    <div className="bg-gray-900 text-white overflow-hidden h-9 flex items-center">
      <div className="shrink-0 px-4 h-full flex items-center bg-red-600 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
        Breaking
      </div>
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="flex items-center animate-marquee whitespace-nowrap">
          {doubled.map((title, i) => (
            <span key={i} className="inline-flex items-center px-8 text-[13px] font-medium text-gray-200">
              {title}
              <span className="text-gray-600 px-1"> · </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
