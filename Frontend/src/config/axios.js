import axios from "axios"
import config from "./env.js"

// Use dynamic API base URL from config
const API_BASE_URL = config.apiUrl

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors globally
    if (error.response?.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname
      if (!currentPath.includes("/login") && !currentPath.includes("/register")) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        // Optionally redirect to login
        // window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default instance
