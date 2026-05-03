import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { Menu, X, History, Crown, ChevronDown, Bookmark, User, LogOut, LayoutDashboard } from "lucide-react"
import { cn } from "../lib/utils"

export default function Header({ isAuthenticated, userRole, user, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ]

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="h-16 flex items-center justify-between gap-6">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-black tracking-tight">P</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-extrabold text-gray-900 tracking-tight">propnews24</span>
              <span className="text-[9px] font-semibold text-red-500 uppercase tracking-widest">India Live</span>
            </div>
          </Link>

          {/* ── Desktop nav ───────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline",
                  isActive(to)
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {label}
              </Link>
            ))}
            {userRole === "admin" && (
              <Link
                to="/admin/dashboard"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline flex items-center gap-1.5",
                  isActive("/admin")
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <LayoutDashboard size={13} />
                Admin
              </Link>
            )}
          </nav>

          {/* ── Right actions ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 shrink-0">
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all bg-transparent border-0 cursor-pointer"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all border-0 cursor-pointer shadow-sm"
                >
                  Get started
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                {/* Premium badge */}
                <Link
                  to="/subscription"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold rounded-lg no-underline transition-all"
                >
                  <Crown size={11} className="text-amber-500" /> Premium
                </Link>

                {/* Quick links */}
                <Link
                  to="/bookmarks"
                  title="Bookmarks"
                  className={cn(
                    "p-2 rounded-lg transition-all no-underline",
                    isActive("/bookmarks") ? "text-gray-900 bg-gray-100" : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Bookmark size={16} />
                </Link>
                <Link
                  to="/reading-history"
                  title="Reading History"
                  className={cn(
                    "p-2 rounded-lg transition-all no-underline",
                    isActive("/reading-history") ? "text-gray-900 bg-gray-100" : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <History size={16} />
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all border-0 cursor-pointer bg-transparent"
                  >
                    <div className="w-7 h-7 bg-gray-900 rounded-full text-white text-xs font-bold flex items-center justify-center">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">{user?.username}</span>
                    <ChevronDown size={13} className={cn("text-gray-400 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-gray-100 shadow-lg z-20 overflow-hidden py-1">
                        <div className="px-3 py-2 border-b border-gray-50">
                          <p className="text-xs font-semibold text-gray-900 truncate">{user?.username}</p>
                          <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline transition-colors"
                        >
                          <User size={14} className="text-gray-400" /> Profile
                        </Link>
                        <Link
                          to="/bookmarks"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline transition-colors"
                        >
                          <Bookmark size={14} className="text-gray-400" /> Bookmarks
                        </Link>
                        <Link
                          to="/reading-history"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline transition-colors"
                        >
                          <History size={14} className="text-gray-400" /> Reading History
                        </Link>
                        {userRole === "admin" && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline transition-colors"
                          >
                            <LayoutDashboard size={14} className="text-gray-400" /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button
                            onClick={() => { onLogout(); setUserMenuOpen(false) }}
                            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 bg-transparent border-0 cursor-pointer transition-colors"
                          >
                            <LogOut size={14} /> Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 bg-transparent border-0 cursor-pointer transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} className="text-gray-700" /> : <Menu size={18} className="text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="max-w-[1200px] mx-auto px-5 py-3 flex flex-col gap-0.5">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg no-underline transition-colors",
                  isActive(to) ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <div className="my-1 border-t border-gray-100" />
                <Link to="/bookmarks" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg no-underline transition-colors">
                  <Bookmark size={14} /> Bookmarks
                </Link>
                <Link to="/reading-history" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg no-underline transition-colors">
                  <History size={14} /> Reading History
                </Link>
                <Link to="/subscription" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-50 rounded-lg no-underline transition-colors">
                  <Crown size={14} className="text-amber-500" /> Premium
                </Link>
                {userRole === "admin" && (
                  <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg no-underline transition-colors">
                    <LayoutDashboard size={14} /> Admin Panel
                  </Link>
                )}
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg no-underline transition-colors">
                  <User size={14} /> Profile
                </Link>
                <div className="my-1 border-t border-gray-100" />
                <button onClick={() => { onLogout(); setMobileOpen(false) }} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg bg-transparent border-0 cursor-pointer transition-colors">
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <>
                <div className="my-1 border-t border-gray-100" />
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg no-underline transition-colors">
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center px-3 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg no-underline transition-colors mt-1">
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
