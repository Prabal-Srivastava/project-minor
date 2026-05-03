import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Sparkles, Loader2, ExternalLink } from "lucide-react"
import api from "../config/axios"

function timeAgo(dateStr) {
  if (!dateStr) return ""
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

export default function RelatedArticles({ currentArticle, allArticles }) {
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!currentArticle || !allArticles?.length) return
    setLoading(true)
    api.post("/api/v1/user/ai/cluster", { articles: allArticles })
      .then((r) => {
        if (!r.data.success) return
        const clusters = r.data.data.clusters || []
        const cluster = clusters.find(
          (c) =>
            c.mainArticle?.url === currentArticle.url ||
            c.relatedArticles?.some((a) => a.url === currentArticle.url)
        )
        if (cluster) {
          const related = [cluster.mainArticle, ...(cluster.relatedArticles || [])]
            .filter((a) => a?.url && a.url !== currentArticle.url)
          setRelatedArticles(related.slice(0, 3))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [currentArticle, allArticles])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center gap-3">
          <Loader2 size={18} className="text-purple-600 animate-spin" />
          <span className="text-sm text-gray-600">Finding related articles...</span>
        </div>
      </div>
    )
  }

  if (!relatedArticles.length) return null

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Related Articles</h3>
          <p className="text-xs text-gray-500">AI-powered recommendations</p>
        </div>
      </div>

      <div className="space-y-3">
        {relatedArticles.map((article, i) => (
          <Link
            key={`${article.url}-${i}`}
            to={`/news/${encodeURIComponent(article.url)}`}
            state={{ article }}
            className="block p-3 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all no-underline group"
          >
            <div className="flex gap-3">
              {article.urlToImage && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-purple-600 transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {article.source?.name && <span className="truncate">{article.source.name}</span>}
                  {article.publishedAt && <><span>·</span><span>{timeAgo(article.publishedAt)}</span></>}
                </div>
              </div>
              <ExternalLink size={14} className="text-gray-300 group-hover:text-purple-500 transition-colors shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
