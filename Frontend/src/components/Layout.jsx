import { Outlet, useNavigate } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

export default function Layout({ isAuthenticated, userRole, user, onLogout }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        user={user}
        onLogout={() => { onLogout(); navigate("/") }}
      />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-5 md:px-8 pt-10 pb-20">
        <Outlet />
      </main>
      <Footer isAuthenticated={isAuthenticated} />
    </div>
  )
}
