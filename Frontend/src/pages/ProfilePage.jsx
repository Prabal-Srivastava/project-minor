import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pencil, X, ArrowLeft, User as UserIcon, Mail, Shield } from "lucide-react"
import api from "../config/axios"

export default function ProfilePage({ user }) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(user)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ username: user?.username || "", email: user?.email || "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.put("/api/v1/user/profile", formData)
      setProfile(response.data.data)
      setIsEditing(false)
      localStorage.setItem("user", JSON.stringify(response.data.data))
      alert("Profile updated successfully!")
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile")
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
        <div className="h-32 bg-gradient-to-r from-red-600 to-orange-500 relative">
          <div className="absolute -bottom-16 left-8 w-32 h-32 rounded-full bg-white p-2 shadow-lg">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-4xl font-bold text-white">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        <div className="pt-20 pb-8 px-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{profile?.username}</h1>
            <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
              <Mail size={14} /> {profile?.email}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wide border border-red-100">
              <Shield size={10} /> {profile?.role}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl border-0 cursor-pointer font-semibold shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all text-sm"
          >
            {isEditing ? <><X size={16} /> Cancel</> : <><Pencil size={16} /> Edit Profile</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        {/* Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 fade-in-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Account Stats</h3>
          <div className="flex flex-col gap-4">
            {[
              { label: "Joined", value: new Date().toLocaleDateString(), icon: <UserIcon size={14} /> },
              { label: "Status", value: "Active", green: true, icon: <Shield size={14} /> },
            ].map(({ label, value, green, icon }) => (
              <div key={label} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 text-sm font-medium flex items-center gap-2">
                  {icon} {label}
                </span>
                <span className={`text-sm font-bold ${green ? "text-green-600" : "text-gray-900"}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Profile info / edit form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
          {!isEditing ? (
            <div className="flex flex-col gap-6">
              {[
                { label: "Username", value: profile?.username, icon: <UserIcon size={14} /> },
                { label: "Email Address", value: profile?.email, icon: <Mail size={14} /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                    {icon} {label}
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {[
                { label: "Username", name: "username", type: "text", icon: <UserIcon size={14} /> },
                { label: "Email Address", name: "email", type: "email", icon: <Mail size={14} /> },
              ].map(({ label, name, type, icon }) => (
                <div key={name} className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    {icon} {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base font-medium outline-none transition-all focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              ))}
              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl border-0 cursor-pointer font-bold shadow-lg hover:bg-red-700 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
