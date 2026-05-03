import { useState } from "react"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import api from "../config/axios"

/**
 * NewsletterSignup — "Get the morning headlines in your inbox" widget.
 * Can be embedded anywhere: footer, sidebar, homepage CTA, etc.
 *
 * Props:
 *   compact  — renders a smaller inline version (default: false)
 *   className — extra Tailwind classes for the wrapper
 */
export default function NewsletterSignup({ compact = false, className = "" }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("idle") // idle | loading | success | error
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("loading")
    setMessage("")

    try {
      const res = await api.post("/api/v1/user/newsletter/subscribe", {
        email: email.trim().toLowerCase(),
        frequency: "daily",
      })
      setStatus("success")
      setMessage(res.data.message || "You're subscribed! Check your inbox at 8 AM.")
      setEmail("")
    } catch (err) {
      setStatus("error")
      const msg = err.response?.data?.message || "Something went wrong. Please try again."
      // Treat "already subscribed" as a soft success
      if (msg.toLowerCase().includes("already subscribed")) {
        setStatus("success")
        setMessage("You're already subscribed — headlines are on their way every morning!")
      } else {
        setMessage(msg)
      }
    }
  }

  if (compact) {
    return (
      <div className={`${className}`}>
        {status === "success" ? (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle size={16} />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-white"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg border-0 cursor-pointer transition-colors disabled:opacity-60 shrink-0"
            >
              {status === "loading" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Mail size={14} />
              )}
              Subscribe
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-1.5 text-xs text-red-500">{message}</p>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 rounded-2xl p-8 text-white ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-600/30 border border-red-500/40 rounded-xl flex items-center justify-center">
          <Mail size={20} className="text-red-300" />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-red-400">Newsletter</p>
          <h3 className="text-lg font-extrabold leading-tight">Morning Headlines</h3>
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-6">
        Get the top India news stories delivered to your inbox every morning at <strong className="text-white">8:00 AM</strong>. No spam, just the news that matters.
      </p>

      {status === "success" ? (
        <div className="flex items-start gap-3 bg-green-500/20 border border-green-500/30 rounded-xl p-4">
          <CheckCircle size={20} className="text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-300 text-sm">You're subscribed!</p>
            <p className="text-green-400/80 text-xs mt-0.5">{message}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-red-400/50 transition-all placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl border-0 cursor-pointer transition-all disabled:opacity-60 text-sm shadow-lg hover:shadow-red-500/30"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Subscribing…
              </>
            ) : (
              <>
                <Mail size={16} />
                Get the morning headlines
              </>
            )}
          </button>
          {status === "error" && (
            <p className="text-red-300 text-xs text-center">{message}</p>
          )}
        </form>
      )}

      <p className="text-gray-500 text-xs text-center mt-4">
        Unsubscribe anytime. We respect your inbox.
      </p>
    </div>
  )
}
