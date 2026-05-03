import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Trash2 } from "lucide-react"
import api from "../../config/axios"
import AdminPageLayout from "../../components/AdminPageLayout"
import { cn } from "../../lib/utils"

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchComments() }, [])

  const fetchComments = async () => {
    try {
      const r = await api.get("/api/v1/admin/comments")
      setComments(r.data.data || [])
    } catch { /* silently fail */ } finally { setLoading(false) }
  }

  const handleApprove = async (id, isApproved) => {
    try { await api.put(`/api/v1/admin/comments/${id}/approve`, { isApproved }); fetchComments() }
    catch { alert("Failed to update comment") }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return
    try { await api.delete(`/api/v1/admin/comments/${id}`); fetchComments() }
    catch { alert("Failed to delete comment") }
  }

  return (
    <AdminPageLayout title="Moderate Comments">
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                {["User", "Article URL", "Comment", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm text-gray-900">{comment.user?.username || "Unknown"}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {comment.articleUrl ? (
                      <a href={comment.articleUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 no-underline hover:text-blue-700 break-all">
                        {comment.articleUrl}
                      </a>
                    ) : "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700 max-w-96">{comment.content}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-xs font-medium",
                      comment.isApproved ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-700"
                    )}>
                      {comment.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {!comment.isApproved && (
                        <button onClick={() => handleApprove(comment._id, true)} className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 bg-transparent border-0 cursor-pointer transition-colors">
                          <CheckCircle size={14} /> Approve
                        </button>
                      )}
                      {comment.isApproved && (
                        <button onClick={() => handleApprove(comment._id, false)} className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700 bg-transparent border-0 cursor-pointer transition-colors">
                          <XCircle size={14} /> Reject
                        </button>
                      )}
                      <button onClick={() => handleDelete(comment._id)} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 bg-transparent border-0 cursor-pointer transition-colors">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {comments.length === 0 && <div className="text-center py-12 text-gray-400">No comments found</div>}
        </div>
      )}
    </AdminPageLayout>
  )
}
