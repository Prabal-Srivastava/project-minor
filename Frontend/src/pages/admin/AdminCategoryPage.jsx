import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import api from "../../config/axios"
import AdminPageLayout from "../../components/AdminPageLayout"

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({ name: "" })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    try {
      const r = await api.get("/api/v1/admin/categories")
      setCategories(r.data.data || [])
    } catch { /* silently fail */ } finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) { await api.put(`/api/v1/admin/categories/${editingId}`, formData) }
      else { await api.post("/api/v1/admin/categories", formData) }
      setFormData({ name: "" }); setEditingId(null); fetchCategories()
    } catch (e) { alert(e.response?.data?.message || "Failed to save category") }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return
    try { await api.delete(`/api/v1/admin/categories/${id}`); fetchCategories() }
    catch (e) { alert(e.response?.data?.message || "Failed to delete category") }
  }

  return (
    <AdminPageLayout title="Manage Categories">
      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
            />
          </div>
          <button
            type="submit"
            className="self-start px-6 py-2 bg-blue-600 text-white rounded-lg border-0 cursor-pointer text-base font-medium hover:bg-blue-700 transition-colors"
          >
            {editingId ? "Update" : "Add"} Category
          </button>
        </form>

        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
                <span className="font-medium text-gray-900">{cat.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setFormData({ name: cat.name }); setEditingId(cat._id) }}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 bg-transparent border-0 cursor-pointer transition-colors"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 bg-transparent border-0 cursor-pointer transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPageLayout>
  )
}
