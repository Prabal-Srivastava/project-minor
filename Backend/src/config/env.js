import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Resolve .env relative to this file so it works regardless of cwd
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../../.env") });

// Auto-detect environment
const isDevelopment = process.env.NODE_ENV !== "production";
const isProduction = process.env.NODE_ENV === "production";

// Dynamic URL configuration
const getClientUrl = () => {
	if (process.env.CLIENT_URL) return process.env.CLIENT_URL;
	return isDevelopment ? "http://localhost:5173" : "http://localhost:5173";
};

const getServerUrl = () => {
	if (process.env.SERVER_URL) return process.env.SERVER_URL;
	const port = process.env.PORT || 5000;
	return isDevelopment ? `http://localhost:${port}` : `http://localhost:${port}`;
};

const env = {
	// Environment
	NODE_ENV: process.env.NODE_ENV || "development",
	IS_DEVELOPMENT: isDevelopment,
	IS_PRODUCTION: isProduction,
	
	// Server
	PORT: parseInt(process.env.PORT || "5000", 10),
	HOST: process.env.HOST || "0.0.0.0",
	
	// URLs (Dynamic)
	CLIENT_URL: getClientUrl(),
	SERVER_URL: getServerUrl(),
	
	// Database
	MONGO_URI: process.env.MONGO_URI,
	
	// Security
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",
	JWT_COOKIE_EXPIRE: parseInt(process.env.JWT_COOKIE_EXPIRE || "30", 10),
	
	// External APIs
	NEWS_API_KEY: process.env.NEWS_API_KEY,
	NEWS_API_BASE_URL: process.env.NEWS_API_BASE_URL || "https://newsdata.io/api/1",
	
	// Stripe
	STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
	STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
	STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
	
	// Email
	EMAIL_HOST: process.env.EMAIL_HOST,
	EMAIL_PORT: parseInt(process.env.EMAIL_PORT || "587", 10),
	EMAIL_USER: process.env.EMAIL_USER,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
	EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER,
	
	// Legacy SMTP (for backward compatibility)
	SMTP_HOST: process.env.SMTP_HOST || process.env.EMAIL_HOST,
	SMTP_PORT: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587", 10),
	SMTP_USER: process.env.SMTP_USER || process.env.EMAIL_USER,
	SMTP_PASS: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
	
	// AI Services
	GEMINI_API_KEY: process.env.GEMINI_API_KEY,
	
	// File Upload
	UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
	MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10), // 10MB default
	
	// Rate Limiting
	RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || "900000", 10), // 15 min
	RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
	AUTH_RATE_LIMIT_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX || "5", 10),
	
	// CORS
	CORS_ORIGIN: process.env.CORS_ORIGIN || getClientUrl(),
	
	// Logging
	LOG_LEVEL: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
};

// Required variables — app will not start without these
const requiredEnvs = ["MONGO_URI", "JWT_SECRET", "NEWS_API_KEY"];
const missingEnvs = requiredEnvs.filter((name) => !process.env[name]);

if (missingEnvs.length > 0) {
	console.error(`❌ Missing required environment variables: ${missingEnvs.join(", ")}`);
	console.error(`\n📝 Please create a .env file in the Backend directory with these variables.`);
	console.error(`\nExample .env file:`);
	console.error(`MONGO_URI=mongodb://localhost:27017/news_db`);
	console.error(`JWT_SECRET=your-secret-key-here`);
	console.error(`NEWS_API_KEY=your-newsapi-key-here`);
	console.error(`CLIENT_URL=http://localhost:5173`);
	process.exit(1);
}

// Log configuration on startup (only in development)
if (isDevelopment) {
	console.log("\n🔧 Configuration loaded:");
	console.log(`   Environment: ${env.NODE_ENV}`);
	console.log(`   Server URL: ${env.SERVER_URL}`);
	console.log(`   Client URL: ${env.CLIENT_URL}`);
	console.log(`   Port: ${env.PORT}`);
	console.log(`   MongoDB: ${env.MONGO_URI ? "✓ Configured" : "✗ Missing"}`);
	console.log(`   JWT Secret: ${env.JWT_SECRET ? "✓ Configured" : "✗ Missing"}`);
	console.log(`   News API: ${env.NEWS_API_KEY ? "✓ Configured" : "✗ Missing"}`);
	console.log(`   Stripe: ${env.STRIPE_SECRET_KEY ? "✓ Configured" : "✗ Not configured"}`);
	console.log(`   Email: ${env.EMAIL_HOST ? "✓ Configured" : "✗ Not configured"}`);
	console.log(`   AI (Gemini): ${env.GEMINI_API_KEY ? "✓ Configured" : "✗ Not configured"}\n`);
}

export default env;
