import { useEffect, useState, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import ExternalNewsCard from "../components/ExternalNewsCard"
import BreakingNews from "../components/BreakingNews"
import NewsCardSkeleton from "../components/NewsCardSkeleton"
import PollOfTheDay from "../components/PollOfTheDay"
import VibeFilter from "../components/VibeFilter"
import SEO from "../components/SEO"
import NewsletterSignup from "../components/NewsletterSignup"
import AdBanner from "../components/AdBanner"
import PremiumBanner from "../components/PremiumBanner"
import {
  Search, TrendingUp, Globe, Zap, Shield, Users,
  ArrowRight, LogIn, UserPlus, Newspaper, Star, Crown
} from "lucide-react"
import { cn } from "../lib/utils"
import api from "../config/axios"

const NEWSDATA_CATEGORIES = [
  "top","business","technology","sports","entertainment",
  "health","science","politics","world","crime",
]
const adultKeywords = ["sex","porn","xxx","adult","nude","erotic","naked"]

// ── Guest landing page ──────────────────────────────────────────────────────
function GuestLanding() {
  const navigate = useNavigate()
  const features = [
    { icon: <Globe size={22} />, title: "India-First Coverage", desc: "Curated news from every corner of India — politics, business, sports and more." },
    { icon: <Zap size={22} />, title: "Real-Time Updates", desc: "Breaking stories delivered the moment they happen, powered by live APIs." },
    { icon: <Shield size={22} />, title: "Safe & Filtered", desc: "Adult content filtered out. Clean, family-friendly news experience." },
    { icon: <Users size={22} />, title: "Community Comments", desc: "Discuss stories with other readers. Share your perspective." },
    { icon: <Star size={22} />, title: "Bookmark Articles", desc: "Save articles to read later. Your personal news library." },
    { icon: <TrendingUp size={22} />, title: "10 Categories", desc: "Top, Politics, Business, Tech, Sports, Entertainment and more." },
  ]

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 text-white -mx-6 md:-mx-10 px-6 md:px-10 py-24 md:py-36">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            🇮🇳 India Live News
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Stay informed.<br />
            <span className="text-red-400">Stay ahead.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl mb-10">
            propnews24 brings you real-time India news across 10 categories — politics, business, sports, tech and more. Sign in to unlock the full experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-red-500/30 border-0 cursor-pointer text-base"
            >
              <LogIn size={18} /> Sign In to Read News
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all cursor-pointer text-base"
            >
              <UserPlus size={18} /> Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-200 -mx-6 md:-mx-10 px-6 md:px-10 py-6">
        <div className="flex flex-wrap gap-8 justify-center md:justify-start">
          {[
            { label: "Live Articles", value: "10,000+" },
            { label: "Categories", value: "10" },
            { label: "Updated", value: "Every hour" },
            { label: "Country", value: "🇮🇳 India" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center md:text-left">
              <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Why propnews24</p>
          <h2 className="text-3xl font-extrabold text-gray-900">Everything you need to stay informed</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-red-600 to-red-500 -mx-6 md:-mx-10 px-6 md:px-10 py-16 text-white text-center">
        <Newspaper size={40} className="mx-auto mb-4 opacity-80" />
        <h2 className="text-3xl font-extrabold mb-3">Ready to read the news?</h2>
        <p className="text-red-100 mb-8 max-w-md mx-auto">Create a free account in seconds and get access to all India news, categories, bookmarks and comments.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 px-8 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all border-0 cursor-pointer text-base shadow-lg"
          >
            <UserPlus size={18} /> Get Started Free <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-8 py-3 bg-transparent text-white font-semibold rounded-xl border border-white/40 hover:bg-white/10 transition-all cursor-pointer text-base"
          >
            <LogIn size={18} /> Sign In
          </button>
        </div>
      </section>
    </div>
  )
}

// ── Authenticated news feed ──────────────────────────────────────────────────
export default function HomePage() {
  const isAuthenticated = !!localStorage.getItem("token")

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [externalNews, setExternalNews] = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [loadingExternal, setLoadingExternal] = useState(true)
  const [newsError, setNewsError] = useState("")
  const [selectedVibe, setSelectedVibe] = useState("all")
  const [aiAvailable, setAiAvailable] = useState(false)
  const [articleLimit, setArticleLimit] = useState(null)
  const [showPaywall, setShowPaywall] = useState(false)

  // ── Functions declared BEFORE useEffect to avoid TDZ in minified bundle ──

  const fetchArticleLimit = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const res = await api.get("/api/v1/user/subscription/article-limit")
      setArticleLimit(res.data.data)
      if (res.data.data && !res.data.data.allowed) setShowPaywall(true)
    } catch {}
  }, [isAuthenticated])

  const checkAIStatus = useCallback(async () => {
    try {
      const response = await api.get("/api/v1/user/ai/status")
      setAiAvailable(response.data.features?.sentimentAnalysis || false)
    } catch {}
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const r = await api.get("/api/v1/user/categories")
      setCategories(r.data.data || [])
    } catch {}
  }, [])

  const fetchExternalNews = useCallback(async () => {
    setLoadingExternal(true)
    setNewsError("")
    try {
      const params = new URLSearchParams()
      params.append("country", "in")
      if (debouncedSearch) params.append("q", debouncedSearch)
      if (selectedCategory && categories.length > 0) {
        const sel = categories.find((c) => c._id === selectedCategory)
        if (sel?.name) {
          const slug = sel.name.toLowerCase()
          if (NEWSDATA_CATEGORIES.includes(slug)) params.append("category", slug)
        }
      }
      const r = await api.get(`/api/v1/visitor/news/external?${params.toString()}`)
      let articles = (r.data.articles || [])
        .filter((a) => a.urlToImage && a.urlToImage.trim() !== "")
        .filter((a) => {
          const t = `${a.title} ${a.description} ${a.content}`.toLowerCase()
          return !adultKeywords.some((kw) => t.includes(kw))
        })
      setExternalNews(articles)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to load news"
      setNewsError(msg)
    } finally {
      setLoadingExternal(false)
    }
  }, [selectedCategory, debouncedSearch, categories])

  const applyVibeFilter = useCallback(async () => {
    if (selectedVibe === "all" || !aiAvailable) {
      setFilteredNews(externalNews)
      return
    }
    try {
      const response = await api.post("/api/v1/user/ai/filter-by-vibe", {
        articles: externalNews,
        vibe: selectedVibe,
      })
      if (response.data.success) setFilteredNews(response.data.data.articles)
    } catch {
      setFilteredNews(externalNews)
    }
  }, [selectedVibe, aiAvailable, externalNews])

  // ── useEffect hooks AFTER all function declarations ───────────────────────

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 600)
    return () => clearTimeout(t)
  }, [searchTerm])

  useEffect(() => {
    if (!isAuthenticated) return
    fetchCategories()
    checkAIStatus()
    fetchArticleLimit()
  }, [])

  useEffect(() => {
    if (isAuthenticated) fetchExternalNews()
  }, [selectedCategory, debouncedSearch])

  useEffect(() => { applyVibeFilter() }, [externalNews, selectedVibe])

  // Show guest landing if not logged in — after all hooks
  if (!isAuthenticated) return <GuestLanding />

  const activeCatName = selectedCategory
    ? categories.find((c) => c._id === selectedCategory)?.name || "News"
    : "Top India News"

  return (
    <div className="flex flex-col gap-0">
      <SEO 
        title="India News - Latest Breaking News, Politics, Business, Sports"
        description="Get real-time India news across 10 categories including politics, business, sports, technology, entertainment and more. Stay informed with propnews24."
        keywords="India news, breaking news, latest news, politics news, business news, sports news, technology news, entertainment news"
        url="/"
      />
      
      {/* Breaking ticker */}
      <div className="-mx-6 md:-mx-10">
        <BreakingNews news={externalNews.slice(0, 6)} />
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 border-b border-gray-200 bg-white -mx-6 md:-mx-10 px-6 md:px-10">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-red-600 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          🇮🇳 India Live Updates
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 max-w-2xl mb-3">
          India News, <span className="text-red-600">simplified.</span>
        </h1>
        <p className="text-base text-gray-500 max-w-lg mb-6">
          Latest breaking news, politics, business, sports and more — straight from India.
        </p>
        <button
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors border-0 cursor-pointer rounded-lg"
          onClick={() => document.getElementById("news-grid")?.scrollIntoView({ behavior: "smooth" })}
        >
          <Newspaper size={16} /> Read latest
        </button>
      </section>

      {/* Sticky search + category bar */}
      <section id="categories-bar" className="py-4 border-b border-gray-200 sticky top-[60px] bg-white z-10 shadow-sm -mx-6 md:-mx-10 px-6 md:px-10">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-60 shrink-0">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search India news…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer",
                  selectedCategory === null
                    ? "bg-red-600 text-white border-red-600 shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-red-400 hover:text-red-600"
                )}
              >All</button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={cn(
                    "px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer",
                    selectedCategory === cat._id
                      ? "bg-red-600 text-white border-red-600 shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:border-red-400 hover:text-red-600"
                  )}
                >{cat.name}</button>
              ))}
            </div>
          </div>

          {/* Vibe Filter - Only show if AI is available */}
          {aiAvailable && (
            <div className="pt-2 border-t border-gray-100">
              <VibeFilter selectedVibe={selectedVibe} onVibeChange={setSelectedVibe} />
            </div>
          )}
        </div>
      </section>

      {/* Paywall overlay */}
      {showPaywall && <PremiumBanner limit={articleLimit?.limit || 5} />}

      {/* News grid */}
      <section id="news-grid" className="pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          {/* Main news column */}
          <div>
            {/* Article limit inline banner for free users */}
            {articleLimit && !articleLimit.isPremium && articleLimit.remaining <= 2 && articleLimit.remaining > 0 && (
              <div className="mb-6">
                <PremiumBanner inline remaining={articleLimit.remaining} limit={articleLimit.limit} />
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Latest Headlines</p>
                <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-0.5 flex items-center gap-2">
                  <TrendingUp size={18} className="text-red-600" /> {activeCatName}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {articleLimit && !articleLimit.isPremium && (
                  <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                    {articleLimit.remaining}/{articleLimit.limit} free
                  </span>
                )}
                {articleLimit?.isPremium && (
                  <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                    <Crown size={11} /> Premium
                  </span>
                )}
                {!loadingExternal && filteredNews.length > 0 && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                    {filteredNews.length} articles
                  </span>
                )}
              </div>
            </div>

            {loadingExternal ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)}
              </div>
            ) : newsError ? (
              <div className="py-16 text-center border border-red-200 bg-red-50 rounded-2xl">
                <Zap size={32} className="mx-auto text-red-400 mb-3" />
                <p className="font-semibold text-red-600 mb-1">Failed to load news</p>
                <p className="text-xs text-red-400">{newsError}</p>
              </div>
            ) : filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredNews.map((article, i) => (
                  <div key={`${article.url}-${i}`} className="fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <ExternalNewsCard article={article} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-gray-200 rounded-2xl bg-white">
                <Newspaper size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400">No articles found for this {selectedVibe !== "all" ? "vibe" : "category"}.</p>
              </div>
            )}

            {/* Mid-feed ad for free users — shown after the grid */}
            {!articleLimit?.isPremium && filteredNews.length >= 6 && (
              <AdBanner slot="rectangle" className="mt-6" />
            )}

            {/* Leaderboard ad at the bottom for free users */}
            {!articleLimit?.isPremium && filteredNews.length > 0 && (
              <AdBanner slot="leaderboard" className="mt-4" />
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-6">
              <PollOfTheDay />
              {/* Newsletter signup in sidebar */}
              <NewsletterSignup />
              {/* Sidebar ad for free users */}
              {!articleLimit?.isPremium && <AdBanner slot="sidebar" />}
            </div>
          </aside>
        </div>
      </section>

      {/* Newsletter CTA at the bottom of the feed (mobile-friendly) */}
      <section className="mt-12 lg:hidden">
        <NewsletterSignup />
      </section>
    </div>
  )
}
