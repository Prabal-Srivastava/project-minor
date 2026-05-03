import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation, Link } from "react-router-dom"
import {
  ArrowLeft, Eye, Calendar, User, Tag, Send,
  Pencil, Trash2, MessageCircle, Building2,
  ExternalLink, Bookmark, BookmarkCheck, Newspaper, LogIn
} from "lucide-react"
import { getImageUrl } from "../utils/imageUrl"
import SEO from "../components/SEO"
import SmartSummary from "../components/SmartSummary"
import RelatedArticles from "../components/RelatedArticles"
import api from "../config/axios"

function timeAgo(dateStr) {
  if (!dateStr) return ""
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function ArticleSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="skeleton h-5 w-20 mb-6 rounded" />
      <div className="skeleton w-full rounded-2xl mb-6" style={{ aspectRatio: "16/9" }} />
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="skeleton h-7 w-3/4 mb-3 rounded" />
        <div className="skeleton h-7 w-1/2 mb-6 rounded" />
        <div className="flex gap-4 mb-6">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-4 w-16 rounded" />
        </div>
        {[100, 95, 90, 85, 80, 70, 60].map((w, i) => (
          <div key={i} className="skeleton h-4 mb-3 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
}

export default function NewsDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [article, setArticle] = useState(location.state?.article || null)
  const [articleUrl, setArticleUrl] = useState("")
  const [fullContent, setFullContent] = useState("")
  const [loadingFullContent, setLoadingFullContent] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingContent, setEditingContent] = useState("")
  const [bookmarked, setBookmarked] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [allArticles, setAllArticles] = useState([])
  const [aiAvailable, setAiAvailable] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
    const storedUser = localStorage.getItem("user")
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try { const p = JSON.parse(storedUser); if (p?._id) setCurrentUserId(p._id) } catch {}
    }
    const isSlug = /^[a-zA-Z0-9_-]+$/.test(id)
    if (isSlug) {
      fetchInternalNews(id)
    } else {
      const decodedUrl = decodeURIComponent(id)
      setArticleUrl(decodedUrl)
      if (!article) setArticle({ url: decodedUrl, title: "Loading…" })
      fetchComments(decodedUrl)
      // Fetch full content for external articles
      fetchFullArticleContent(decodedUrl)
      setLoading(false)
    }
    checkAIStatus()
    fetchAllArticles()
  }, [id])

  // Track reading history when article is viewed
  useEffect(() => {
    if (article && article.url && isAuthenticated) {
      trackReadingHistory()
    }
  }, [article, isAuthenticated])

  const trackReadingHistory = async () => {
    if (!article || !article.url) return
    
    try {
      await api.post("/api/v1/user/reading-history", {
        articleUrl: article.url,
        title: article.title,
        description: article.description,
        imageUrl: article.urlToImage,
        sourceName: article.source?.name,
        publishedAt: article.publishedAt,
      })
    } catch (error) {
      // silently ignore tracking errors
    }
  }

  const checkAIStatus = async () => {
    try {
      const response = await api.get("/api/v1/user/ai/status")
      setAiAvailable(response.data.aiAvailable || false)
    } catch {
      // AI not available
    }
  }

  const fetchAllArticles = async () => {
    try {
      const response = await api.get("/api/v1/visitor/news/external?country=in&pageSize=20")
      if (response.data.articles) {
        setAllArticles(response.data.articles.filter((a) => a.urlToImage))
      }
    } catch {
      // silently fail — related articles won't show
    }
  }

  const fetchFullArticleContent = async (url) => {
    if (!url) return
    setLoadingFullContent(true)
    try {
      const response = await api.get(`/api/v1/visitor/news/external/full-content?url=${encodeURIComponent(url)}`)
      if (response.data.success && response.data.content) {
        setFullContent(response.data.content)
      }
    } catch {
      // silently fail — fallback content will be shown
    } finally {
      setLoadingFullContent(false)
    }
  }

  const fetchComments = async (url = articleUrl) => {
    if (!url) return
    try {
      const r = await api.get(`/api/v1/user/comments/news/${encodeURIComponent(url)}`)
      setComments(r.data.data || [])
    } catch {}
  }

  const fetchInternalNews = async (slug) => {
    try {
      const r = await api.get(`/api/v1/visitor/news/${slug}`)
      if (r.data.success) { setArticle(r.data.data); fetchInternalComments(r.data.data._id) }
    } catch { setLoading(false) }
  }

  const fetchInternalComments = async (newsId) => {
    try {
      const r = await api.get(`/api/v1/visitor/news/${newsId}/comments`)
      setComments(r.data.data || [])
    } catch {}
    setLoading(false)
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { navigate("/login"); return }
    setCommentLoading(true)
    try {
      if (article._id) {
        await api.post(`/api/v1/visitor/news/${article._id}/comments`, { content: newComment })
        fetchInternalComments(article._id)
      } else {
        await api.post(`/api/v1/user/comments/${encodeURIComponent(articleUrl)}`, { content: newComment })
        fetchComments(articleUrl)
      }
      setNewComment("")
    } catch (err) { alert(err.response?.data?.message || "Failed to post comment") }
    finally { setCommentLoading(false) }
  }

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return
    try {
      await api.delete(`/api/v1/user/comments/${commentId}`)
      article._id ? fetchInternalComments(article._id) : fetchComments(articleUrl)
    } catch (err) { alert(err.response?.data?.message || "Failed to delete") }
  }

  const handleCommentUpdate = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/api/v1/user/comments/${editingCommentId}`, { content: editingContent })
      setEditingCommentId(null); setEditingContent("")
      article._id ? fetchInternalComments(article._id) : fetchComments(articleUrl)
    } catch (err) { alert(err.response?.data?.message || "Failed to update") }
  }

  const handleBookmark = async () => {
    if (!isAuthenticated) { navigate("/login"); return }
    const url = articleUrl || article?.url || ""
    if (!url) return
    try {
      await api.post(`/api/v1/user/bookmarks/${encodeURIComponent(url)}`, {
        title: article?.title,
        description: article?.description,
        imageUrl: article?.urlToImage,
        sourceName: article?.source?.name,
        publishedAt: article?.publishedAt,
      })
      setBookmarked((p) => !p)
    } catch {}
  }

  if (loading) return <ArticleSkeleton />
  if (!article) return (
    <div className="text-center py-24 text-gray-400">
      <Newspaper size={40} className="mx-auto mb-3 text-gray-300" />
      Article not found
    </div>
  )

  const heroImage = article.featuredImage
    ? getImageUrl(article.featuredImage)
    : (!imgError && article.urlToImage ? article.urlToImage : null)

  const isExternal = !article._id

  return (
    <div className="max-w-3xl mx-auto fade-in">
      <SEO 
        title={article.title || "Article"}
        description={article.description || article.content?.substring(0, 160) || "Read the full article on propnews24"}
        keywords={`${article.category?.name || "news"}, India news, ${article.source?.name || "breaking news"}`}
        image={article.featuredImage ? getImageUrl(article.featuredImage) : article.urlToImage}
        url={`/news/${id}`}
        type="article"
        author={article.author?.username || article.source?.name || "propnews24"}
        publishedTime={article.publishedAt || article.createdAt}
        section={article.category?.name}
        tags={article.category?.name ? [article.category.name] : []}
      />
      
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Hero image */}
      {heroImage && (
        <div className="w-full overflow-hidden rounded-2xl mb-6 bg-gray-100 shadow-md" style={{ aspectRatio: "16/9" }}>
          <img
            src={heroImage}
            alt={article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          {/* Category badge */}
          {article.category?.name && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100 mb-4">
              <Tag size={10} /> {article.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-5">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 pb-5 mb-6 border-b border-gray-100">
            {(article.createdAt || article.publishedAt) && (
              <span className="flex items-center gap-1">
                <Calendar size={11} /> {timeAgo(article.createdAt || article.publishedAt)}
              </span>
            )}
            {article.author?.username && (
              <span className="flex items-center gap-1">
                <User size={11} /> {article.author.username}
              </span>
            )}
            {article.source?.name && (
              <span className="flex items-center gap-1">
                <Building2 size={11} /> {article.source.name}
              </span>
            )}
            {article.views > 0 && (
              <span className="flex items-center gap-1">
                <Eye size={11} /> {article.views.toLocaleString()} views
              </span>
            )}
            <div className="ml-auto flex items-center gap-2">
              {isExternal && (
                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                    bookmarked ? "bg-red-600 border-red-600 text-white" : "bg-white border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-600"
                  }`}
                >
                  {bookmarked ? <BookmarkCheck size={11} /> : <Bookmark size={11} />}
                  {bookmarked ? "Saved" : "Save"}
                </button>
              )}
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500 hover:text-gray-700 no-underline transition-colors"
                >
                  <ExternalLink size={11} /> Source
                </a>
              )}
            </div>
          </div>

          {/* AI Smart Summary - Only show if AI is available and article has content */}
          {aiAvailable && isExternal && (fullContent || article.content) && (
            <SmartSummary article={{ ...article, content: fullContent || article.content }} />
          )}

          {/* Content */}
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {loadingFullContent ? (
              <div className="flex items-center gap-3 py-8">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                <span className="text-gray-500">Loading full article content...</span>
              </div>
            ) : fullContent ? (
              // Display full scraped content
              fullContent.split("\n").filter(Boolean).map((para, i) => (
                <p key={i} className="mb-4 text-[15px] leading-7">{para}</p>
              ))
            ) : (
              // Fallback to original content
              (article.content || article.description || "No content available.")
                .split("\n")
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="mb-4 text-[15px] leading-7">{para}</p>
                ))
            )}
          </div>

          {/* Read original link for external */}
          {isExternal && article.url && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl no-underline hover:bg-gray-700 transition-colors"
              >
                <ExternalLink size={14} /> Read full article on source
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Related Articles - Only show if AI is available */}
      {aiAvailable && isExternal && allArticles.length > 0 && (
        <RelatedArticles currentArticle={article} allArticles={allArticles} />
      )}

      {/* Comments section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageCircle size={18} className="text-red-600" />
          Comments ({comments.length})
        </h3>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this article…"
              rows={3}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-gray-50 focus:bg-white"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={commentLoading || !newComment.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-xl border-0 cursor-pointer text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={13} /> {commentLoading ? "Posting…" : "Post Comment"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
            <p className="text-sm text-gray-500 mb-3">Sign in to join the conversation</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-xl no-underline text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              <LogIn size={14} /> Sign In
            </Link>
          </div>
        )}

        {/* Comment list */}
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No comments yet. Be the first!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  {comment.user?.username?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">{comment.user?.username || "Anonymous"}</span>
                    <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                  </div>

                  {editingCommentId === comment._id ? (
                    <form onSubmit={handleCommentUpdate} className="flex flex-col gap-2 mt-2">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-500 transition-all resize-none"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="px-3 py-1 bg-red-600 text-white rounded-lg border-0 cursor-pointer text-xs font-semibold hover:bg-red-700 transition-colors">Save</button>
                        <button type="button" onClick={() => { setEditingCommentId(null); setEditingContent("") }} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg border-0 cursor-pointer text-xs hover:bg-gray-300 transition-colors">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                  )}

                  {currentUserId && comment.user?._id === currentUserId && editingCommentId !== comment._id && (
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => { setEditingCommentId(comment._id); setEditingContent(comment.content) }}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 bg-transparent border-0 cursor-pointer transition-colors"
                      >
                        <Pencil size={10} /> Edit
                      </button>
                      <button
                        onClick={() => handleCommentDelete(comment._id)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 bg-transparent border-0 cursor-pointer transition-colors"
                      >
                        <Trash2 size={10} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
