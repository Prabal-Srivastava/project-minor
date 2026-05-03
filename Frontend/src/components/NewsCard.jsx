import { Link } from "react-router-dom"
import { getImageUrl } from "../utils/imageUrl"
import { Eye, MessageCircle } from "lucide-react"

function truncate(text, max = 120) {
  if (!text) return ""
  return text.length <= max ? text : text.substring(0, max) + "..."
}

export default function NewsCard({ news }) {
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl hover:border-red-300 transition-all duration-300">
      {news.featuredImage && (
        <div className="relative overflow-hidden h-56 sm:h-48">
          <img
            src={getImageUrl(news.featuredImage) || "/placeholder.svg"}
            alt={news.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-300">
            {news.category?.name || "General"}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(news.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 text-black line-clamp-2 hover:text-red-600 transition-colors">
          {news.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {truncate(news.excerpt || news.content)}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Link
            to={`/news/${news.slug || news._id}`}
            className="text-red-600 font-semibold text-sm flex items-center gap-2 no-underline hover:text-red-700 transition-colors"
          >
            Read More →
          </Link>
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Eye size={12} /> {news.views || 0}</span>
            <span className="flex items-center gap-1"><MessageCircle size={12} /> {news.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
