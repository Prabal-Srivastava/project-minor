import config from "../config/env.js"

// Construct full image URLs for uploaded files.
// Uses dynamic backend URL from config
const BACKEND_URL = config.backendUrl

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath
  if (imagePath.startsWith("/uploads/")) return `${BACKEND_URL}${imagePath}`
  if (!imagePath.startsWith("/")) return `${BACKEND_URL}/uploads/${imagePath}`
  return `${BACKEND_URL}${imagePath}`
}
