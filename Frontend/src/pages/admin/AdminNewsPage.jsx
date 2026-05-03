import { useEffect, useState } from "react"
import { RefreshCw, Download, ExternalLink } from "lucide-react"
import api from "../../config/axios"
import AdminPageLayout from "../../components/AdminPageLayout"

// All categories supported by NewsData.io (lowercase = API slug)
const NEWSDATA_CATEGORIES = [
  "top", "business", "technology", "sports", "entertainment",
  "health", "science", "politics", "world", "crime",
]

export default function AdminNewsPage() {
  const [categories, setCategories] = useState([])
  const [externalNews, setExternalNews] = useState([])
  const [loadingExternal, setLoadingExternal] = useState(true)
  const [importCategory, setImportCategory] = useState("")
  const [importLoading, setImportLoading] = useState(false)

  useEffect(() => { fetchCategories(); fetchExternalNews() }, [])

  const fetchCategories = async () => {
    try { const r = await api.get("/api/v1/user/categories"); setCategories(r.data.data || []) }
    catch { /* silently fail */ }
  }

  const fetchExternalNews = async () => {
    setLoadingExternal(true)
    try {
      const params = new URLSearchParams()
      params.append("country", "in")
      if (importCategory && categories.length > 0) {
        const sel = categories.find((c) => c._id === importCategory)
        if (sel?.name) {
          const slug = sel.name.toLowerCase()
          if (NEWSDATA_CATEGORIES.includes(slug)) params.append("category", slug)
        }
      }
      const r = await api.get(`/api/v1/admin/news/external?${params.toString()}`)
      setExternalNews(r.data.articles || [])
    } catch { /* silently fail */ } finally { setLoadingExternal(false) }
  }

  const importSingleArticle = async (article) => {
    if (!importCategory) { alert("Please select a category for the imported news"); return }
    setImportLoading(true)
    try {
      const r = await api.post("/api/v1/admin/news/import", {
        title: article.title,
        content: article.content || article.description,
        description: article.description,
        urlToImage: article.urlToImage,
        url: article.url,
        publishedAt: article.publishedAt,
        categoryId: importCategory,
        isFeatured: false,
      })
      if (r.data.success) { alert("News article imported successfully!"); fetchExternalNews() }
    } catch (e) { alert(e.response?.data?.message || "Failed to import news") } finally { setImportLoading(false) }
  }

  const importAllExternalNews = async () => {
    if (!importCategory) { alert("Please select a category for the imported news"); return }
    setImportLoading(true)
    try {
      const r = await api.post("/api/v1/admin/news/import", { fromApi: true, categoryId: importCategory })
      if (r.data.success) { alert(`${r.data.count} news articles imported successfully!`); fetchExternalNews() }
    } catch (e) { alert(e.response?.data?.message || "Failed to import news") } finally { setImportLoading(false) }
  }

  return (
    <AdminPageLayout title="External News">
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-semibold text-gray-900">External Headlines</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={importCategory}
                onChange={(e) => setImportCategory(e.target.value)}
                className="text-sm px-2 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-all"
              >
                <option value="">Select category for import</option>
                {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
              <button
                type="button"
                onClick={fetchExternalNews}
                disabled={loadingExternal}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 cursor-pointer transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={loadingExternal ? "animate-spin" : ""} /> Refresh
              </button>
              <button
                type="button"
                onClick={importAllExternalNews}
                disabled={importLoading || !importCategory || loadingExternal}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-green-600 text-white border-0 cursor-pointer hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download size={14} /> {importLoading ? "Importing..." : "Import All"}
              </button>
            </div>
          </div>

          {loadingExternal ? (
            <p className="text-sm text-gray-400">Loading external news...</p>
          ) : externalNews.length > 0 ? (
            <div className="flex flex-col max-h-[480px] overflow-y-auto">
              {externalNews.map((article, index) => (
                <div key={index} className="py-3 flex flex-col gap-1 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-900 line-clamp-2">{article.title}</span>
                      {article.publishedAt && (
                        <div className="text-xs text-gray-400 mt-0.5">{new Date(article.publishedAt).toLocaleString()}</div>
                      )}
                      {article.source?.name && (
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">
                          {article.source.name}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => importSingleArticle(article)}
                        disabled={importLoading || !importCategory}
                        className="text-xs px-2 py-1 rounded-lg border border-green-600 text-green-600 bg-transparent hover:bg-green-50 cursor-pointer transition-colors disabled:opacity-50"
                      >
                        Import
                      </button>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 no-underline hover:text-blue-700 transition-colors"
                      >
                        View <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">{article.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No external news available.</p>
          )}
        </div>
      </div>
    </AdminPageLayout>
  )
}
