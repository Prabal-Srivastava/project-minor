import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AlertCircle } from "lucide-react"
import api from "../../config/axios"

export default function AdminResetPasswordPage({ setIsAuthenticated, setUser, setUserRole }) {
  const navigate = useNavigate()
  const { token } = useParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (!token) navigate("/admin/forgot-password") }, [token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("")
    if (password !== confirmPassword) { setError("Passwords do not match"); return }
    if (password.length < 8) { setError("Password must be at least 8 characters long"); return }
    setLoading(true)
    try {
      const response = await api.post(`/api/v1/admin/auth/reset-password/${token}`, { password })
      const { token: authToken, user } = response.data.data
      localStorage.setItem("token", authToken)
      localStorage.setItem("user", JSON.stringify(user))
      setIsAuthenticated(true); setUser(user); setUserRole(user.role)
      navigate("/admin/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. The link may have expired.")
    } finally { setLoading(false) }
  }

  return (
    <div className="py-12 flex items-start justify-center">
      <div className="w-full max-w-md">
        <button onClick={() => navigate("/login")} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer text-base">
          ← Back to Login
        </button>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Admin Reset Password</h2>
          <p className="text-gray-500">Enter your new admin password</p>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" /><span>{error}</span>
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {[
              { label: "New Password", value: password, onChange: setPassword },
              { label: "Confirm Password", value: confirmPassword, onChange: setConfirmPassword },
            ].map(({ label, value, onChange }) => (
              <div key={label} className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900">{label}</label>
                <input
                  type="password"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg text-base outline-none transition-all hover:border-gray-400 focus:border-red-500 focus:ring-3 focus:ring-red-500/20"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-3 rounded-lg shadow-md border-0 cursor-pointer text-base transition-all hover:from-red-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
