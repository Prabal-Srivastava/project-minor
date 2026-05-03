import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Newspaper, Users, MessageCircle, Bookmark } from "lucide-react"
import api from "../../config/axios"
import AdminPageLayout from "../../components/AdminPageLayout"

const quickLinks = [
  { to: "/admin/news", icon: "🌍", title: "External News", desc: "Browse live headlines and trending topics.", manage: "Manage", gradient: "from-blue-600 to-blue-400" },
  { to: "/admin/categories", icon: "📂", title: "Categories", desc: "Organize news grouping and filters.", manage: "Configure", gradient: "from-green-600 to-green-400" },
  { to: "/admin/users", icon: "👤", title: "Users & Roles", desc: "Manage accounts and permissions.", manage: "Administer", gradient: "from-purple-600 to-purple-400" },
  { to: "/admin/comments", icon: "💬", title: "Comments", desc: "Review, approve, or remove comments.", manage: "Moderate", gradient: "from-orange-600 to-orange-400" },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalArticles: 0, totalUsers: 0, totalComments: 0, totalBookmarks: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/api/v1/admin/analytics/dashboard")
      .then((r) => setStats(r.data.data || stats))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { icon: <Newspaper size={24} />, num: stats.totalArticles, label: "Tracked Articles", bg: "bg-blue-100", color: "text-blue-600" },
    { icon: <Users size={24} />, num: stats.totalUsers, label: "Total Users", bg: "bg-green-100", color: "text-green-600" },
    { icon: <MessageCircle size={24} />, num: stats.totalComments, label: "Comments", bg: "bg-purple-100", color: "text-purple-600" },
    { icon: <Bookmark size={24} />, num: stats.totalBookmarks, label: "Bookmarks", bg: "bg-orange-100", color: "text-orange-600" },
  ]

  return (
    <AdminPageLayout title="Admin Overview">
      <div className="flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out_forwards]">
        <p className="text-gray-500">Welcome back! Here's what's happening on your platform today.</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map(({ icon, num, label, bg, color }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center`}>
                  {icon}
                </div>
                <div>
                  <span className="block text-3xl font-bold text-gray-900">{num}</span>
                  <span className="text-sm font-medium text-gray-500">{label}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map(({ to, icon, title, desc, gradient, manage }) => (
            <Link
              key={to}
              to={to}
              className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 text-white shadow-lg no-underline hover:-translate-y-1 transition-all duration-200`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm text-2xl">{icon}</div>
                <span className="text-sm font-medium text-white/60">{manage}</span>
              </div>
              <h3 className="text-xl font-bold mb-1">{title}</h3>
              <p className="text-sm text-white/80">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminPageLayout>
  )
}
