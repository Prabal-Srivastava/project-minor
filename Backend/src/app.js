import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";

// 1. UTILS & MIDDLEWARES
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

// 2. ADMIN ROUTE IMPORTS
import adminAnalyticsRoutes from "./routes/admin/analytics.routes.js";
import adminAuthRoutes from "./routes/admin/auth.routes.js";
import adminCategoryRoutes from "./routes/admin/category.routes.js";
import adminCommentRoutes from "./routes/admin/comment.routes.js";
import adminNewsRoutes from "./routes/admin/news.routes.js";
import adminSettingsRoutes from "./routes/admin/settings.routes.js";
import adminUserRoutes from "./routes/admin/user.routes.js";
import adminNewsletterRoutes from "./routes/admin/newsletter.routes.js";

// 3. USER ROUTE IMPORTS
import userAuthRoutes from "./routes/user/auth.routes.js";
import userBookmarkRoutes from "./routes/user/bookmark.routes.js";
import userCategoryRoutes from "./routes/user/category.routes.js";
import userCommentRoutes from "./routes/user/comment.routes.js";
import userInteractionRoutes from "./routes/user/interaction.routes.js";
import userNewsRoutes from "./routes/user/news.routes.js";
import userReactionRoutes from "./routes/user/reaction.routes.js";
import userReadingHistoryRoutes from "./routes/user/readingHistory.routes.js";
import userPollRoutes from "./routes/user/poll.routes.js";
import userUserRoutes from "./routes/user/user.routes.js";
import userAIRoutes from "./routes/user/ai.routes.js";
import userSubscriptionRoutes from "./routes/user/subscription.routes.js";
import userNewsletterRoutes from "./routes/user/newsletter.routes.js";

// 4. VISITOR ROUTE IMPORTS
import visitorNewsRoutes from "./routes/visitor/news.routes.js";

// 5. Stripe webhook handler (needs raw body — imported directly)
import { stripeWebhook } from "./controllers/user/subscription.controller.js";

const app = express();

// ---------------------------------------------------------
// GLOBAL MIDDLEWARES (Security & Parsing)
// ---------------------------------------------------------

// Trust Nginx reverse proxy (needed for correct IP in logs and rate limiting)
app.set("trust proxy", 1);

// Set security HTTP headers
app.use(helmet());

// Logging — verbose in dev, concise in production
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
} else {
	app.use(morgan("combined"));
}

// CORS Configuration (Allowing Frontend to send Cookies)
import env from "./config/env.js";

app.use(
	cors({
		origin: env.CORS_ORIGIN,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// ⚠️  STRIPE WEBHOOK — must be registered BEFORE express.json()
// Stripe requires the raw request body for signature verification
app.post(
	"/api/v1/user/subscription/webhook",
	express.raw({ type: "application/json" }),
	stripeWebhook
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Serve static files (Uploaded images)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ---------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------

// Health check endpoint (no authentication required)
app.get("/api/v1/health", (req, res) => {
	res.status(200).json({
		status: "ok",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: process.env.NODE_ENV,
		version: "1.0.0",
	});
});

// --- ADMIN API ENDPOINTS ---
app.use("/api/v1/admin/analytics", adminAnalyticsRoutes);
app.use("/api/v1/admin/auth", adminAuthRoutes);
app.use("/api/v1/admin/categories", adminCategoryRoutes);
app.use("/api/v1/admin/comments", adminCommentRoutes);
app.use("/api/v1/admin/news", adminNewsRoutes);
app.use("/api/v1/admin/settings", adminSettingsRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/admin/newsletter", adminNewsletterRoutes);

// --- USER/PUBLIC API ENDPOINTS ---
app.use("/api/v1/user/auth", userAuthRoutes);
app.use("/api/v1/user/bookmarks", userBookmarkRoutes);
app.use("/api/v1/user/categories", userCategoryRoutes);
app.use("/api/v1/user/comments", userCommentRoutes);
app.use("/api/v1/user/interactions", userInteractionRoutes);
app.use("/api/v1/user/news", userNewsRoutes);
app.use("/api/v1/user/reactions", userReactionRoutes);
app.use("/api/v1/user/reading-history", userReadingHistoryRoutes);
app.use("/api/v1/user/polls", userPollRoutes);
app.use("/api/v1/user/profile", userUserRoutes);
app.use("/api/v1/user/ai", userAIRoutes);
app.use("/api/v1/user/subscription", userSubscriptionRoutes);
app.use("/api/v1/user/newsletter", userNewsletterRoutes);

// --- VISITOR API ENDPOINTS ---
app.use("/api/v1/visitor/news", visitorNewsRoutes);

// ---------------------------------------------------------
// ERROR HANDLING
// ---------------------------------------------------------

// Catch 404 and forward to error handler
app.use(notFound);

// Global Error Handler (Handles ErrorResponse instances)
app.use(errorHandler);

export default app;
