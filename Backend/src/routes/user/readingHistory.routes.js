import express from "express";
import {
	addArticleToHistory,
	getReadingHistory,
	deleteHistoryEntry,
	clearHistory,
	getReadingStats,
} from "../../controllers/user/readingHistory.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get reading statistics
router.get("/stats", getReadingStats);

// Get reading history
router.get("/", getReadingHistory);

// Add article to reading history
router.post("/", addArticleToHistory);

// Clear all reading history
router.delete("/", clearHistory);

// Delete specific reading history entry
router.delete("/:articleUrl", deleteHistoryEntry);

export default router;
