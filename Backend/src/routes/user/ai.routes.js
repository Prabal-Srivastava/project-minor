import express from "express";
import {
	getAIStatus,
	generateSummary,
	analyzeSentimentEndpoint,
	extractKeywordsEndpoint,
	clusterArticlesEndpoint,
	filterByVibeEndpoint,
	analyzeArticleEndpoint,
} from "../../controllers/user/ai.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public endpoint to check AI availability
router.get("/status", getAIStatus);

// Protected AI endpoints (require authentication)
router.use(protect);

router.post("/summary", generateSummary);
router.post("/sentiment", analyzeSentimentEndpoint);
router.post("/keywords", extractKeywordsEndpoint);
router.post("/cluster", clusterArticlesEndpoint);
router.post("/filter-by-vibe", filterByVibeEndpoint);
router.post("/analyze", analyzeArticleEndpoint);

export default router;
