import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../config/axios"
import NewsletterSignup from "./NewsletterSignup"

export default function Footer({ isAuthenticated }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.get("/api/v1/user/categories").then((r) => setCategories(r.data?.data || [])).catch(() => {})
  }, [])

  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      {/* Top section */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr] gap-10">

          {/* ── Brand ──────────────────────────────────────────────────── */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-black">P</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-extrabold text-white tracking-tight">propnews24</span>
                <span className="text-[9px] font-semibold text-red-400 uppercase tracking-widest">India Live</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[260px] mb-6">
              Your trusted source for real-time India news across politics, business, sports, technology and more.
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              {[
                {
                  href: "https://facebook.com/propnews24",
                  label: "Facebook",
                  icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
                },
                {
                  href: "https://instagram.com/propnews24",
                  label: "Instagram",
                  icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />,
                },
                {
                  href: "mailto:info@propnews24.com",
                  label: "Email",
                  icon: <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />,
                },
              ].map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white no-underline transition-all"
                >
                  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">{icon}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* ── Navigation ─────────────────────────────────────────────── */}
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Navigation</p>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/subscription", label: "Premium" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-500 hover:text-white no-underline transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Categories ─────────────────────────────────────────────── */}
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Categories</p>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {categories.length > 0
                ? categories.slice(0, 7).map((cat) => (
                    <li key={cat._id}>
                      <Link to={`/?category=${cat._id}`} className="text-sm text-gray-500 hover:text-white no-underline transition-colors">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                : ["Politics", "Business", "Sports", "Technology", "Health"].map((c) => (
                    <li key={c}><span className="text-sm text-gray-600">{c}</span></li>
                  ))
              }
            </ul>
          </div>

          {/* ── Newsletter ─────────────────────────────────────────────── */}
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Morning Headlines</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Get the top India news stories delivered to your inbox every morning at 8 AM.
            </p>
            <NewsletterSignup compact />
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} propnews24. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="text-xs text-gray-600 hover:text-gray-400 no-underline transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-xs text-gray-600 hover:text-gray-400 no-underline transition-colors">
              Terms of Service
            </Link>
            <span className="text-xs text-gray-700 flex items-center gap-1">
              🇮🇳 Made for India
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
