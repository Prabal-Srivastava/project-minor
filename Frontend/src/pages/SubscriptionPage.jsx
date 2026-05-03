import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Crown, Check, Zap, Shield, Star, X, AlertCircle } from "lucide-react"
import api from "../config/axios"
import SEO from "../components/SEO"

function PricingCard({ cycle, isAuthenticated }) {
  const navigate = useNavigate()
  const monthly = cycle === "monthly"
  const price = monthly ? 299 : 2999
  const perMonth = monthly ? 299 : Math.round(2999 / 12)
  const saving = monthly ? null : "Save ₹600"

  return (
    <div className="relative bg-white rounded-2xl border-2 border-amber-400 shadow-xl overflow-hidden">
      {/* Popular badge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
          {monthly ? "Most Popular" : "Best Value"}
        </span>
      </div>

      <div className="p-8 pt-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <Crown size={24} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">Premium</h3>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              {monthly ? "Monthly" : "Yearly"}
            </p>
          </div>
          {saving && (
            <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {saving}
            </span>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-end gap-1">
            <span className="text-4xl font-extrabold text-gray-900">₹{price}</span>
            <span className="text-gray-400 text-sm mb-1.5">/{monthly ? "month" : "year"}</span>
          </div>
          {!monthly && (
            <p className="text-sm text-gray-500 mt-1">₹{perMonth}/month, billed annually</p>
          )}
        </div>

        <ul className="flex flex-col gap-3 mb-8">
          {[
            "Unlimited articles every day",
            "Ad-free reading experience",
            "AI-powered smart summaries",
            "Related article recommendations",
            "Priority support",
            "Early access to new features",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
              <Check size={16} className="text-green-500 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            if (!isAuthenticated) {
              navigate("/login")
            } else {
              alert("Payment integration coming soon! Please contact support for manual upgrade.")
            }
          }}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl border-0 cursor-pointer transition-all shadow-lg hover:shadow-amber-500/30 text-sm flex items-center justify-center gap-2"
        >
          <Crown size={16} /> {isAuthenticated ? "Contact Support" : "Sign in to Upgrade"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          Contact support for subscription details
        </p>
      </div>
    </div>
  )
}

export default function SubscriptionPage() {
  const [cycle, setCycle] = useState("monthly")
  const [details, setDetails] = useState(null)
  const [articleLimit, setArticleLimit] = useState(null)
  const isAuthenticated = !!localStorage.getItem("token")

  useEffect(() => {
    if (isAuthenticated) {
      fetchDetails()
      fetchArticleLimit()
    }
  }, [])

  const fetchDetails = async () => {
    try {
      const res = await api.get("/api/v1/user/subscription/details")
      setDetails(res.data.data)
    } catch {}
  }

  const fetchArticleLimit = async () => {
    try {
      const res = await api.get("/api/v1/user/subscription/article-limit")
      setArticleLimit(res.data.data)
    } catch {}
  }

  const handleCancel = async () => {
    if (!window.confirm("Cancel your Premium subscription? You'll keep access until the end of the billing period.")) return
    try {
      await api.post("/api/v1/user/subscription/cancel")
      fetchDetails()
      alert("Subscription cancelled. You'll retain Premium access until the period ends.")
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel subscription.")
    }
  }

  const isPremium = details?.tier === "premium" && details?.status === "active"

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 fade-in">
      <SEO
        title="Premium Subscription — propnews24"
        description="Upgrade to Premium for unlimited articles, ad-free reading, and AI-powered summaries."
        url="/subscription"
      />

      {/* Payment not configured notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-800 text-sm font-semibold mb-1">Payment System Coming Soon</p>
          <p className="text-blue-600 text-xs">
            Online payments are currently being set up. To upgrade to Premium now, please contact our support team.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
          <Crown size={13} /> Premium
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Unlock the full experience
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Free users get 5 articles per day. Premium gives you unlimited access, no ads, and AI-powered features.
        </p>
      </div>

      {/* Current plan status */}
      {isAuthenticated && details && (
        <div className={`rounded-xl p-5 mb-10 border ${isPremium ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPremium ? "bg-amber-100" : "bg-gray-200"}`}>
                {isPremium ? <Crown size={20} className="text-amber-600" /> : <Star size={20} className="text-gray-400" />}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  {isPremium ? "Premium Plan" : "Free Plan"}
                </p>
                <p className="text-xs text-gray-500">
                  {isPremium
                    ? `Active${details.endDate ? ` · Renews ${new Date(details.endDate).toLocaleDateString("en-IN")}` : ""}`
                    : articleLimit
                      ? `${articleLimit.remaining} of ${articleLimit.limit} articles left today`
                      : "5 articles per day"}
                </p>
              </div>
            </div>
            {isPremium && details.status !== "cancelled" && (
              <button
                onClick={handleCancel}
                className="text-xs text-red-500 hover:text-red-700 bg-transparent border-0 cursor-pointer font-medium transition-colors"
              >
                Cancel subscription
              </button>
            )}
          </div>
        </div>
      )}

      {/* Billing cycle toggle */}
      {!isPremium && (
        <>
          <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-xl p-1 w-fit mx-auto mb-10">
            {["monthly", "yearly"].map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold border-0 cursor-pointer transition-all capitalize ${
                  cycle === c
                    ? "bg-white text-gray-900 shadow-sm"
                    : "bg-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {c}
                {c === "yearly" && (
                  <span className="ml-1.5 text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">
                    -17%
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Free tier */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Star size={24} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">Free</h3>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Forever</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">₹0</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>

              <ul className="flex flex-col gap-3 mb-8">
                {[
                  { text: "5 articles per day", ok: true },
                  { text: "All 10 news categories", ok: true },
                  { text: "Comments & bookmarks", ok: true },
                  { text: "Ads displayed", ok: false },
                  { text: "Unlimited articles", ok: false },
                  { text: "AI summaries", ok: false },
                ].map(({ text, ok }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-gray-500">
                    {ok
                      ? <Check size={16} className="text-green-500 shrink-0" />
                      : <X size={16} className="text-gray-300 shrink-0" />}
                    {text}
                  </li>
                ))}
              </ul>

              <div className="w-full py-3.5 bg-gray-100 text-gray-500 font-semibold rounded-xl text-sm text-center">
                Current Plan
              </div>
            </div>

            {/* Premium tier */}
            <PricingCard
              cycle={cycle}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </>
      )}

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <Zap size={22} />, title: "Unlimited Reading", desc: "No daily caps. Read as many articles as you want, whenever you want." },
          { icon: <Shield size={22} />, title: "Ad-Free Experience", desc: "Clean, distraction-free reading. No banners, no pop-ups." },
          { icon: <Crown size={22} />, title: "AI-Powered Features", desc: "Smart summaries, sentiment analysis, and related article recommendations." },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              {icon}
            </div>
            <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: "Can I cancel anytime?", a: "Yes. Cancel from your subscription page and you'll keep Premium access until the end of your billing period." },
            { q: "How do I upgrade?", a: "Contact our support team to manually upgrade your account. Online payments will be available soon." },
            { q: "What happens when I hit the free limit?", a: "You'll see a prompt to upgrade. Your limit resets every day at midnight." },
            { q: "Is my data secure?", a: "Yes. We use industry-standard security practices to protect your data and privacy." },
          ].map(({ q, a }) => (
            <div key={q}>
              <p className="font-semibold text-gray-900 text-sm mb-1">{q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
