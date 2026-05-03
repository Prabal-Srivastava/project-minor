import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AlertCircle, CheckCircle } from "lucide-react"
import api from "../config/axios"

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(""); setSuccess(""); setLoading(true)
    try {
      await api.post("/api/v1/user/auth/forgot-password", { email })
      setSuccess("If that email exists, a password reset link has been sent.")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.")
    } finally { setLoading(false) }
  }

  return (
    <div className="py-12 flex items-start justify-center">
      <div className="w-full max-w-md">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer text-base">
          ← Back
        </button>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Forgot Password</h2>
          <p className="text-gray-500">Enter your email to receive a password reset link</p>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" /><span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-3">
            <CheckCircle size={18} className="shrink-0 mt-0.5" /><span>{success}</span>
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg text-base outline-none transition-all hover:border-gray-400 focus:border-red-500 focus:ring-3 focus:ring-red-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-3 rounded-lg shadow-md border-0 cursor-pointer text-base transition-all hover:from-red-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Remember your password?</span></div>
          </div>
          <Link to="/login" className="block text-center px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg no-underline transition-all hover:border-red-500 hover:text-red-600 hover:bg-red-50">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
