/**
 * Frontend Environment Configuration
 * 
 * This file centralizes all environment-dependent configuration.
 * All URLs and settings are dynamically determined based on environment.
 */

// Detect environment
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const mode = import.meta.env.MODE;

/**
 * Get API Base URL
 * Priority: VITE_API_URL > Auto-detect based on environment
 */
const getApiUrl = () => {
  // If explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development: Use Vite proxy (empty string means same origin)
  if (isDevelopment) {
    return "";
  }
  
  // Production: Use current origin (same domain as frontend)
  if (isProduction) {
    return window.location.origin;
  }
  
  // Fallback
  return "";
};

/**
 * Get Backend URL for static files (uploads, etc.)
 * In production, this is usually the same as API URL
 * In development, it needs to point to the backend server
 */
const getBackendUrl = () => {
  // If explicitly set, use it
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // If API URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development: Point to backend server
  if (isDevelopment) {
    return "http://localhost:5000";
  }
  
  // Production: Same as current origin
  return window.location.origin;
};

/**
 * Get Stripe Publishable Key
 */
const getStripeKey = () => {
  return import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
};

/**
 * Get App Name
 */
const getAppName = () => {
  return import.meta.env.VITE_APP_NAME || "News App";
};

/**
 * Get App Description
 */
const getAppDescription = () => {
  return import.meta.env.VITE_APP_DESCRIPTION || "Your daily news source";
};

// Export configuration object
const config = {
  // Environment
  isDevelopment,
  isProduction,
  mode,
  
  // URLs
  apiUrl: getApiUrl(),
  backendUrl: getBackendUrl(),
  
  // API Endpoints (constructed dynamically)
  api: {
    base: getApiUrl(),
    
    // Auth endpoints
    auth: {
      register: "/api/v1/user/auth/register",
      login: "/api/v1/user/auth/login",
      logout: "/api/v1/user/auth/logout",
      forgotPassword: "/api/v1/user/auth/forgot-password",
      resetPassword: (token) => `/api/v1/user/auth/reset-password/${token}`,
    },
    
    // Admin auth endpoints
    adminAuth: {
      login: "/api/v1/admin/auth/login",
      forgotPassword: "/api/v1/admin/auth/forgot-password",
      resetPassword: (token) => `/api/v1/admin/auth/reset-password/${token}`,
    },
    
    // User endpoints
    user: {
      profile: "/api/v1/user/profile",
      bookmarks: "/api/v1/user/bookmarks",
      readingHistory: "/api/v1/user/reading-history",
      subscription: "/api/v1/user/subscription",
    },
    
    // News endpoints
    news: {
      visitor: "/api/v1/visitor/news",
      external: "/api/v1/visitor/news/external",
      detail: (slug) => `/api/v1/visitor/news/${slug}`,
    },
    
    // Admin endpoints
    admin: {
      dashboard: "/api/v1/admin/analytics/dashboard",
      news: "/api/v1/admin/news",
      categories: "/api/v1/admin/categories",
      users: "/api/v1/admin/users",
      comments: "/api/v1/admin/comments",
    },
  },
  
  // External services
  stripe: {
    publishableKey: getStripeKey(),
  },
  
  // App metadata
  app: {
    name: getAppName(),
    description: getAppDescription(),
  },
  
  // Feature flags (can be controlled via env vars)
  features: {
    enableAI: import.meta.env.VITE_ENABLE_AI !== "false",
    enableSubscriptions: import.meta.env.VITE_ENABLE_SUBSCRIPTIONS !== "false",
    enableComments: import.meta.env.VITE_ENABLE_COMMENTS !== "false",
    enableBookmarks: import.meta.env.VITE_ENABLE_BOOKMARKS !== "false",
  },
};

// Log configuration in development
if (isDevelopment) {
  console.log("🔧 Frontend Configuration:");
  console.log("   Environment:", mode);
  console.log("   API URL:", config.apiUrl || "(using proxy)");
  console.log("   Backend URL:", config.backendUrl);
  console.log("   Stripe:", config.stripe.publishableKey ? "✓ Configured" : "✗ Not configured");
  console.log("   Features:", config.features);
}

export default config;
