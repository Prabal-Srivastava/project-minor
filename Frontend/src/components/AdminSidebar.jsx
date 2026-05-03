import { Link, useLocation } from "react-router-dom"
import { cn } from "../lib/utils"

const items = [
  { name: "Dashboard",     path: "/admin/dashboard",  icon: "◈" },
  { name: "External News", path: "/admin/news",        icon: "◎" },
  { name: "Categories",    path: "/admin/categories",  icon: "◫" },
  { name: "Users",         path: "/admin/users",       icon: "◉" },
  { name: "Comments",      path: "/admin/comments",    icon: "◌" },
]

export default function AdminSidebar() {
  const { pathname } = useLocation()
  return (
    <aside className="hidden md:flex flex-col w-[220px] shrink-0 bg-white border-r border-gray-200 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto">
      <div className="flex-1 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">Admin</p>
        <nav className="flex flex-col gap-0.5">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium no-underline rounded-md transition-all",
                pathname === item.path
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <span className="text-[15px] leading-none">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-500">System online</span>
        </div>
      </div>
    </aside>
  )
}
