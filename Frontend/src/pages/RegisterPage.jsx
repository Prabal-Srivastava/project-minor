import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AlertCircle, User, Mail, Lock, ArrowLeft, UserPlus, Eye, EyeOff } from "lucide-react"
import api from "../config/axios"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return }
    setLoading(true)
    try {
      await api.post("/api/v1/user/auth/register", {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      })
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { label: "Username", name: "name", type: "text", placeholder: "johndoe", pattern: "[a-zA-Z0-9]+", title: "Username must contain only letters and numbers", icon: <User size={14} className="text-gray-400" /> },
    { label: "Email Address", name: "email", type: "email", placeholder: "john@example.com", icon: <Mail size={14} className="text-gray-400" /> },
  ]

  return (
    <div className="py-12 flex items-start justify-center fade-in">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus size={28} className="text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Create Account</h2>
          <p className="text-gray-500">Join us to read the latest news</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {fields.map(({ label, name, type, placeholder, pattern, title, icon }) => (
              <div key={name} className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  {icon}
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  pattern={pattern}
                  title={title}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl text-base outline-none transition-all hover:border-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                />
              </div>
            ))}
            
            {/* Password field with toggle */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Lock size={14} className="text-gray-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
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

            {/* Confirm Password field with toggle */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Lock size={14} className="text-gray-400" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
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
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="block text-center px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg no-underline transition-all hover:border-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
