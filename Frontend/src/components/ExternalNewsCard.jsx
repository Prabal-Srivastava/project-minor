import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Bookmark, BookmarkCheck, ExternalLink, Clock, Building2 } from "lucide-react"
import api from "../config/axios"

function timeAgo(dateStr) {
  if (!dateStr) return ""
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function ExternalNewsCard({ article }) {
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [imgError, setImgError] = useState(false)
  const navigate = useNavigate()

  // Don't render if no image or image failed
  if (!article.urlToImage || imgError) return null

  const encodedUrl = encodeURIComponent(article.url)

  const handleBookmark = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (bookmarkLoading) return
    setBookmarkLoading(true)
    try {
      await api.post(`/api/v1/user/bookmarks/${encodedUrl}`, {
        title: article.title,
        description: article.description || article.content,
        imageUrl: article.urlToImage,
        sourceName: article.source?.name,
        publishedAt: article.publishedAt,
      })
      setBookmarked((p) => !p)
    } catch (e) {
      if (e.response?.status === 401) { navigate("/login"); return }
      // bookmark failed silently
    } finally {
      setBookmarkLoading(false)
    }
  }

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <Link to={`/news/${encodedUrl}`} state={{ article }} className="block overflow-hidden aspect-video bg-gray-100 shrink-0">
        <img
          src={article.urlToImage}
          alt={article.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Source + time */}
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-red-600 truncate">
            <Building2 size={10} className="shrink-0" />
            {article.source?.name || "News"}
          </span>
          {article.publishedAt && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
              <Clock size={10} />
              {timeAgo(article.publishedAt)}
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          to={`/news/${encodedUrl}`}
          state={{ article }}
          className="no-underline"
        >
          <h3 className="text-sm font-bold leading-snug text-gray-900 line-clamp-3 group-hover:text-red-600 transition-colors">
            {article.title}
          </h3>
        </Link>

        {/* Description */}
        {article.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
            {article.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <Link
            to={`/news/${encodedUrl}`}
            state={{ article }}
            className="text-xs font-semibold text-red-600 no-underline flex items-center gap-1 hover:gap-2 transition-all"
          >
            Read full article →
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              title={bookmarked ? "Remove bookmark" : "Bookmark"}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                bookmarked
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-white border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-600"
              }`}
            >
              {bookmarked ? <BookmarkCheck size={11} /> : <Bookmark size={11} />}
              {bookmarked ? "Saved" : "Save"}
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open original"
              className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors no-underline"
            >
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
