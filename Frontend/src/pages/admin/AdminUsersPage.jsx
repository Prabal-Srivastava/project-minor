import { useEffect, useState } from "react"
import api from "../../config/axios"
import AdminPageLayout from "../../components/AdminPageLayout"
import { cn } from "../../lib/utils"

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/api/v1/admin/users")
      .then((r) => setUsers(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminPageLayout title="Manage Users">
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                {["Name", "Email", "Role", "Status", "Joined"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm text-gray-900">{user.username}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-3 text-sm text-gray-500 capitalize">{user.role}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-xs font-medium",
                      user.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    )}>
                      {user.status === "active" ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPageLayout>
  )
}
