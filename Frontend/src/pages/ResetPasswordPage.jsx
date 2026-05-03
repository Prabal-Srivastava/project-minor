import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AlertCircle, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"
import api from "../config/axios"

export default function ResetPasswordPage({ setIsAuthenticated, setUser, setUserRole }) {
  const navigate = useNavigate()
  const { token } = useParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (!token) navigate("/forgot-password") }, [token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("")
    if (password !== confirmPassword) { setError("Passwords do not match"); return }
    if (password.length < 8) { setError("Password must be at least 8 characters long"); return }
    setLoading(true)
    try {
      const response = await api.post(`/api/v1/user/auth/reset-password/${token}`, { password })
      const { token: authToken, user } = response.data.data
      localStorage.setItem("token", authToken)
      localStorage.setItem("user", JSON.stringify(user))
      setIsAuthenticated(true); setUser(user); setUserRole(user.role)
      navigate(user.role === "admin" ? "/admin/dashboard" : "/")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. The link may have expired.")
    } finally { setLoading(false) }
  }

  return (
    <div className="py-12 flex items-start justify-center fade-in">
      <div className="w-full max-w-md">
        <button 
          onClick={() => navigate("/login")} 
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock size={28} className="text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Reset Password</h2>
          <p className="text-gray-500">Enter your new password</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Lock size={14} className="text-gray-400" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 text-gray-900 rounded-xl text-base outline-none transition-all hover:border-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-0 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Lock size={14} className="text-gray-400" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 text-gray-900 rounded-xl text-base outline-none transition-all hover:border-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-0 cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3.5 rounded-xl shadow-lg border-0 cursor-pointer text-base transition-all hover:from-red-700 hover:to-red-600 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Reset Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
