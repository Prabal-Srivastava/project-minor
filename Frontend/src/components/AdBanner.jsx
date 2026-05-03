import { useNavigate } from "react-router-dom"
import { Crown, X } from "lucide-react"
import { useState } from "react"

/**
 * AdBanner — placeholder ad unit shown to free-tier users.
 *
 * In production, replace the inner content with your actual ad network code
 * (Google AdSense, Media.net, etc.). The wrapper handles the "remove ads"
 * upgrade prompt.
 *
 * Props:
 *   slot     — "leaderboard" | "rectangle" | "sidebar" (controls dimensions)
 *   label    — optional label shown above the ad (default: "Advertisement")
 */
export default function AdBanner({ slot = "rectangle", label = "Advertisement", className = "" }) {
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const dimensions = {
    leaderboard: "w-full h-24",
    rectangle:   "w-full h-64",
    sidebar:     "w-full h-48",
  }

  return (
    <div className={`relative my-4 ${className}`}>
      {/* Label */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-300 hover:text-gray-500 bg-transparent border-0 cursor-pointer p-0.5 transition-colors"
          aria-label="Dismiss ad"
        >
          <X size={12} />
        </button>
      </div>

      {/* Ad slot — replace this div's content with your ad network tag */}
      <div
        className={`${dimensions[slot]} bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 relative overflow-hidden`}
      >
        {/* Decorative background pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #e5e7eb 0, #e5e7eb 1px, transparent 0, transparent 50%)",
            backgroundSize: "12px 12px",
          }}
        />

        {/* Placeholder content — swap with real ad code */}
        <div className="relative z-10 text-center px-4">
          <p className="text-xs text-gray-400 mb-2">Your ad could be here</p>
          <button
            onClick={() => navigate("/subscription")}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-lg border-0 cursor-pointer transition-colors shadow-sm"
          >
            <Crown size={12} /> Remove ads — Go Premium
          </button>
        </div>
      </div>
    </div>
  )
}
