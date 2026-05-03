import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Bookmark, ExternalLink, ArrowLeft, Clock, Building2 } from "lucide-react"
import NewsCardSkeleton from "../components/NewsCardSkeleton"
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

export default function BookmarksPage() {
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/api/v1/user/bookmarks")
      .then((r) => setBookmarks(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6 fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back
      </button>
      
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-red-600 mb-2">Your Collection</p>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Saved Articles</h1>
        {!loading && bookmarks.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">{bookmarks.length} bookmarked article{bookmarks.length !== 1 ? 's' : ''}</p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bm, i) => {
            const encodedUrl = encodeURIComponent(bm.articleUrl)
            return (
              <article 
                key={bm._id} 
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full fade-in-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Image */}
                {bm.imageUrl && (
                  <Link 
                    to={`/news/${encodedUrl}`}
                    state={{ article: { url: bm.articleUrl, title: bm.title, description: bm.description, urlToImage: bm.imageUrl, source: { name: bm.sourceName }, publishedAt: bm.publishedAt } }}
                    className="block overflow-hidden aspect-video bg-gray-100 shrink-0"
                  >
                    <img
                      src={bm.imageUrl}
                      alt={bm.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                )}
                
                <div className="flex flex-col flex-1 p-4 gap-3">
                  {/* Source + time */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-red-600 truncate">
                      <Building2 size={10} className="shrink-0" />
                      {bm.sourceName || "News"}
                    </span>
                    {bm.publishedAt && (
                      <span className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                        <Clock size={10} />
                        {timeAgo(bm.publishedAt)}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <Link
                    to={`/news/${encodedUrl}`}
                    state={{ article: { url: bm.articleUrl, title: bm.title, description: bm.description, urlToImage: bm.imageUrl, source: { name: bm.sourceName }, publishedAt: bm.publishedAt } }}
                    className="no-underline"
                  >
                    <h3 className="text-sm font-bold leading-snug text-gray-900 line-clamp-3 group-hover:text-red-600 transition-colors">
                      {bm.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  {bm.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
                      {bm.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <Link
                      to={`/news/${encodedUrl}`}
                      state={{ article: { url: bm.articleUrl, title: bm.title, description: bm.description, urlToImage: bm.imageUrl, source: { name: bm.sourceName }, publishedAt: bm.publishedAt } }}
                      className="text-xs font-semibold text-red-600 no-underline flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read article →
                    </Link>
                    <a
                      href={bm.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open original"
                      className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors no-underline"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <Bookmark size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-lg font-medium">No bookmarks yet</p>
          <p className="text-sm text-gray-400 mt-1">Start saving articles to read later</p>
        </div>
      )}
    </div>
  )
}
