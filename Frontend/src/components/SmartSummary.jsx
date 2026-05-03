import { useState, useEffect } from "react"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"
import api from "../config/axios"

export default function SmartSummary({ article }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [aiAvailable, setAiAvailable] = useState(false)

  useEffect(() => {
    api.get("/api/v1/user/ai/status")
      .then((r) => setAiAvailable(r.data.features?.smartSummaries || false))
      .catch(() => {})
  }, [])

  const generateSummary = async () => {
    if (!article?.content) return
    setLoading(true)
    setError("")
    try {
      const r = await api.post("/api/v1/user/ai/summary", {
        title: article.title,
        content: article.content || article.description,
      })
      if (r.data.success) setSummary(r.data.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate summary")
    } finally {
      setLoading(false)
    }
  }

  if (!aiAvailable) return null

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">AI Quick Read</h3>
            <p className="text-xs text-gray-500">Powered by Gemini AI</p>
          </div>
        </div>
        {!summary && !loading && (
          <button
            onClick={generateSummary}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all border-0 cursor-pointer"
          >
            <Sparkles size={14} /> Generate Summary
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-4">
          <Loader2 size={18} className="text-purple-600 animate-spin" />
          <span className="text-sm text-gray-600">Generating smart summary...</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-900 mb-1">Failed to generate summary</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {summary && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-purple-600 font-semibold uppercase tracking-wide">
            <Sparkles size={12} /> Key Takeaways
          </div>
          <ul className="space-y-2">
            {summary.bulletPoints?.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                <span className="text-sm text-gray-700 leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
