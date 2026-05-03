import { asyncHandler } from "../../utils/asyncHandler.util.js";
import {
	isGeminiAvailable,
	generateSmartSummary,
	analyzeSentiment,
	extractKeywords,
	clusterArticles,
	filterBySentiment,
	analyzeArticle,
} from "../../services/ai.service.js";
import { ErrorResponse } from "../../utils/errorResponse.util.js";

/**
 * Check if AI features are available
 * @route GET /api/v1/user/ai/status
 */
export const getAIStatus = asyncHandler(async (req, res) => {
	const available = isGeminiAvailable();

	res.status(200).json({
		success: true,
		aiAvailable: available,
		features: {
			smartSummaries: available,
			sentimentAnalysis: true, // Always available (uses local NLP)
			keywordExtraction: true, // Always available (uses local NLP)
			articleClustering: true, // Always available (uses TF-IDF)
		},
		message: available
			? "AI features are enabled"
			: "AI features disabled. Configure GEMINI_API_KEY to enable Smart Summaries.",
	});
});

/**
 * Generate smart summary for an article
 * @route POST /api/v1/user/ai/summary
 */
export const generateSummary = asyncHandler(async (req, res) => {
	const { title, content } = req.body;

	if (!content || content.trim().length < 100) {
		throw new ErrorResponse("Article content is too short for summarization", 400);
	}

	if (!isGeminiAvailable()) {
		throw new ErrorResponse(
			"Smart Summaries are not available. Please configure GEMINI_API_KEY in your environment.",
			503
		);
	}

	const summaryData = await generateSmartSummary(content, title);

	res.status(200).json({
		success: true,
		data: summaryData,
	});
});

/**
 * Analyze sentiment of an article
 * @route POST /api/v1/user/ai/sentiment
 */
export const analyzeSentimentEndpoint = asyncHandler(async (req, res) => {
	const { text } = req.body;

	if (!text || text.trim().length < 10) {
		throw new ErrorResponse("Text is too short for sentiment analysis", 400);
	}

	const sentimentData = analyzeSentiment(text);

	res.status(200).json({
		success: true,
		data: sentimentData,
	});
});

/**
 * Extract keywords from text
 * @route POST /api/v1/user/ai/keywords
 */
export const extractKeywordsEndpoint = asyncHandler(async (req, res) => {
	const { text, limit = 10 } = req.body;

	if (!text || text.trim().length < 20) {
		throw new ErrorResponse("Text is too short for keyword extraction", 400);
	}

	const keywords = extractKeywords(text, limit);

	res.status(200).json({
		success: true,
		data: { keywords },
	});
});

/**
 * Cluster related articles
 * @route POST /api/v1/user/ai/cluster
 */
export const clusterArticlesEndpoint = asyncHandler(async (req, res) => {
	const { articles } = req.body;

	if (!articles || !Array.isArray(articles) || articles.length === 0) {
		throw new ErrorResponse("Articles array is required", 400);
	}

	const clusters = clusterArticles(articles);

	res.status(200).json({
		success: true,
		data: { clusters },
	});
});

/**
 * Filter articles by sentiment/vibe
 * @route POST /api/v1/user/ai/filter-by-vibe
 */
export const filterByVibeEndpoint = asyncHandler(async (req, res) => {
	const { articles, vibe } = req.body;

	if (!articles || !Array.isArray(articles)) {
		throw new ErrorResponse("Articles array is required", 400);
	}

	if (!vibe || !["positive", "negative", "critical", "neutral", "all"].includes(vibe.toLowerCase())) {
		throw new ErrorResponse("Valid vibe filter is required: positive, critical, neutral, or all", 400);
	}

	const filtered = filterBySentiment(articles, vibe.toLowerCase());

	res.status(200).json({
		success: true,
		data: {
			originalCount: articles.length,
			filteredCount: filtered.length,
			vibe,
			articles: filtered,
		},
	});
});

/**
 * Analyze article with all AI features
 * @route POST /api/v1/user/ai/analyze
 */
export const analyzeArticleEndpoint = asyncHandler(async (req, res) => {
	const { article, includeGemini = false } = req.body;

	if (!article || !article.title) {
		throw new ErrorResponse("Article object with title is required", 400);
	}

	const analysis = await analyzeArticle(article, includeGemini);

	res.status(200).json({
		success: true,
		data: analysis,
	});
});
