"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import NewsDetailPage from "./pages/NewsDetailPage"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminNewsPage from "./pages/admin/AdminNewsPage"
import AdminCategoryPage from "./pages/admin/AdminCategoryPage"
import AdminUsersPage from "./pages/admin/AdminUsersPage"
import AdminCommentsPage from "./pages/admin/AdminCommentsPage"
import ProfilePage from "./pages/ProfilePage"
import BookmarksPage from "./pages/BookmarksPage"
import ReadingHistoryPage from "./pages/ReadingHistoryPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import AdminForgotPasswordPage from "./pages/admin/AdminForgotPasswordPage"
import AdminResetPasswordPage from "./pages/admin/AdminResetPasswordPage"
import ContactPage from "./pages/ContactPage"
import AboutUsPage from "./pages/AboutUsPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import SubscriptionPage from "./pages/SubscriptionPage"

// Redirects unauthenticated users to /login, preserving the intended destination
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        const userData = JSON.parse(storedUser)
        if (userData && userData.role) {
          setIsAuthenticated(true)
          setUser(userData)
          setUserRole(userData.role)
        }
      } catch {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUserRole(null)
    setUser(null)
  }

  return (
    <Router>
      <Routes>
        <Route
          element={<Layout isAuthenticated={isAuthenticated} userRole={userRole} user={user} onLogout={handleLogout} />}
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />

          {/* Auth form routes — always accessible */}
          <Route
            path="/login"
            element={
              <LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} setUserRole={setUserRole} />
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={
              <ResetPasswordPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} setUserRole={setUserRole} />
            }
          />
          <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
          <Route
            path="/admin/reset-password/:token"
            element={
              <AdminResetPasswordPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} setUserRole={setUserRole} />
            }
          />

          {/* Protected user routes — redirect to /login if not authenticated */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProfilePage user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <BookmarksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reading-history"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ReadingHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes — redirect to /login if not authenticated or not admin */}
          {userRole === "admin" && (
            <>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/news" element={<AdminNewsPage />} />
              <Route path="/admin/categories" element={<AdminCategoryPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/comments" element={<AdminCommentsPage />} />
            </>
          )}
          {isAuthenticated && userRole !== "admin" && (
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
          )}
          {!isAuthenticated && (
            <Route path="/admin/*" element={<Navigate to="/login" replace />} />
          )}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
