import { useNavigate } from "react-router-dom"
import { Crown, Zap, Lock } from "lucide-react"

/**
 * PremiumBanner — shown when a free user hits their 5-article daily limit.
 *
 * Props:
 *   remaining  — articles left today (0 when limit hit)
 *   limit      — total daily limit (default 5)
 *   inline     — if true, renders a compact inline bar instead of a full overlay
 */
export default function PremiumBanner({ remaining = 0, limit = 5, inline = false }) {
  const navigate = useNavigate()

  if (inline) {
    return (
      <div className="flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 text-amber-700 text-sm">
          <Crown size={15} className="text-amber-500 shrink-0" />
          <span>
            <strong>{remaining}</strong> of {limit} free articles left today
          </span>
        </div>
        <button
          onClick={() => navigate("/subscription")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-lg border-0 cursor-pointer transition-colors shrink-0"
        >
          <Crown size={12} /> Go Premium
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-extrabold mb-2">Daily Limit Reached</h2>
          <p className="text-amber-100 text-sm">
            You've read all {limit} free articles for today.
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          <p className="text-gray-600 text-sm text-center mb-6">
            Upgrade to <strong className="text-gray-900">Premium</strong> for unlimited access, no ads, and AI-powered summaries.
          </p>

          <div className="flex flex-col gap-3 mb-6">
            {[
              { icon: <Zap size={15} />, text: "Unlimited articles every day" },
              { icon: <Lock size={15} />, text: "Ad-free reading experience" },
              { icon: <Crown size={15} />, text: "AI summaries & smart features" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                  {icon}
                </span>
                {text}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/subscription")}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl border-0 cursor-pointer transition-all shadow-lg hover:shadow-amber-500/30 text-sm"
            >
              Upgrade to Premium — ₹299/month
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-xl border-0 cursor-pointer transition-colors text-sm"
            >
              Come back tomorrow (free)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
