import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { History, ExternalLink, ArrowLeft, Clock, Building2, Trash2, BarChart3, BookOpen } from "lucide-react"
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

export default function ReadingHistoryPage() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    fetchReadingHistory()
    fetchStats()
  }, [])

  const fetchReadingHistory = async () => {
    try {
      const response = await api.get("/api/v1/user/reading-history")
      setHistory(response.data.data || [])
    } catch {
      // silently fail — user sees empty state
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/v1/user/reading-history/stats")
      setStats(response.data.data)
    } catch {
      // silently fail
    } finally {
      setStatsLoading(false)
    }
  }

  const handleDelete = async (articleUrl) => {
    if (!window.confirm("Remove this article from your reading history?")) return
    
    try {
      await api.delete(`/api/v1/user/reading-history/${encodeURIComponent(articleUrl)}`)
      setHistory(history.filter(item => item.articleUrl !== articleUrl))
      // Refresh stats
      fetchStats()
    } catch (error) {
      alert("Failed to delete reading history entry")
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm("Clear all reading history? This cannot be undone.")) return
    
    try {
      await api.delete("/api/v1/user/reading-history")
      setHistory([])
      setStats({ totalArticles: 0, totalReads: 0, recentHistory: [] })
    } catch (error) {
      alert("Failed to clear reading history")
    }
  }

  return (
    <div className="flex flex-col gap-6 fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back
      </button>
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-red-600 mb-2 flex items-center gap-2">
            <History size={12} />
            Your Activity
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reading History</h1>
          {!loading && history.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">{history.length} article{history.length !== 1 ? 's' : ''} read</p>
          )}
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 fade-in-up">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{stats.totalArticles}</p>
                <p className="text-xs text-gray-500 font-medium">Articles Read</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <BarChart3 size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{stats.totalReads}</p>
                <p className="text-xs text-gray-500 font-medium">Total Reads</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <History size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">
                  {stats.totalArticles > 0 ? (stats.totalReads / stats.totalArticles).toFixed(1) : 0}
                </p>
                <p className="text-xs text-gray-500 font-medium">Avg Reads/Article</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)}
        </div>
      ) : history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, i) => {
            const encodedUrl = encodeURIComponent(item.articleUrl)
            return (
              <article 
                key={item._id} 
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full fade-in-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Image */}
                {item.imageUrl && (
                  <Link 
                    to={`/news/${encodedUrl}`}
                    state={{ article: { url: item.articleUrl, title: item.title, description: item.description, urlToImage: item.imageUrl, source: { name: item.sourceName }, publishedAt: item.publishedAt } }}
                    className="block overflow-hidden aspect-video bg-gray-100 shrink-0 relative"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Read count badge */}
                    {item.readCount > 1 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <History size={10} />
                        {item.readCount}x
                      </div>
                    )}
                  </Link>
                )}
                
                <div className="flex flex-col flex-1 p-4 gap-3">
                  {/* Source + time */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-red-600 truncate">
                      <Building2 size={10} className="shrink-0" />
                      {item.sourceName || "News"}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                      <Clock size={10} />
                      {timeAgo(item.lastReadAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <Link
                    to={`/news/${encodedUrl}`}
                    state={{ article: { url: item.articleUrl, title: item.title, description: item.description, urlToImage: item.imageUrl, source: { name: item.sourceName }, publishedAt: item.publishedAt } }}
                    className="no-underline"
                  >
                    <h3 className="text-sm font-bold leading-snug text-gray-900 line-clamp-3 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
                      {item.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <Link
                      to={`/news/${encodedUrl}`}
                      state={{ article: { url: item.articleUrl, title: item.title, description: item.description, urlToImage: item.imageUrl, source: { name: item.sourceName }, publishedAt: item.publishedAt } }}
                      className="text-xs font-semibold text-red-600 no-underline flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read again →
                    </Link>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDelete(item.articleUrl)}
                        title="Remove from history"
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                      <a
                        href={item.articleUrl}
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
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <History size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-lg font-medium">No reading history yet</p>
          <p className="text-sm text-gray-400 mt-1">Articles you read will appear here</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl no-underline hover:bg-red-700 transition-colors"
          >
            <BookOpen size={16} />
            Start Reading
          </Link>
        </div>
      )}
    </div>
  )
}
