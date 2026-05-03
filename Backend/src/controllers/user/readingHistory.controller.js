import { asyncHandler } from "../../utils/asyncHandler.util.js";
import {
	addToReadingHistory,
	getUserReadingHistory,
	deleteReadingHistoryEntry,
	clearUserReadingHistory,
	getUserReadingStats,
} from "../../services/readingHistory.service.js";

/**
 * @desc    Add article to reading history
 * @route   POST /api/v1/user/reading-history
 * @access  Private
 */
export const addArticleToHistory = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const { articleUrl, title, description, imageUrl, sourceName, publishedAt } = req.body;

	if (!articleUrl) {
		return res.status(400).json({
			success: false,
			message: "Article URL is required",
		});
	}

	const history = await addToReadingHistory(userId, {
		articleUrl,
		title,
		description,
		imageUrl,
		sourceName,
		publishedAt,
	});

	res.status(200).json({
		success: true,
		message: "Article added to reading history",
		data: history,
	});
});

/**
 * @desc    Get user's reading history
 * @route   GET /api/v1/user/reading-history
 * @access  Private
 */
export const getReadingHistory = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const { page = 1, limit = 20, sortBy = "lastReadAt" } = req.query;

	const result = await getUserReadingHistory(userId, {
		page: parseInt(page),
		limit: parseInt(limit),
		sortBy,
	});

	res.status(200).json({
		success: true,
		data: result.history,
		pagination: result.pagination,
	});
});

/**
 * @desc    Delete a reading history entry
 * @route   DELETE /api/v1/user/reading-history/:articleUrl
 * @access  Private
 */
export const deleteHistoryEntry = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const articleUrl = decodeURIComponent(req.params.articleUrl);

	const result = await deleteReadingHistoryEntry(userId, articleUrl);

	if (!result) {
		return res.status(404).json({
			success: false,
			message: "Reading history entry not found",
		});
	}

	res.status(200).json({
		success: true,
		message: "Reading history entry deleted",
	});
});

/**
 * @desc    Clear all reading history
 * @route   DELETE /api/v1/user/reading-history
 * @access  Private
 */
export const clearHistory = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	const result = await clearUserReadingHistory(userId);

	res.status(200).json({
		success: true,
		message: `Cleared ${result.deletedCount} reading history entries`,
		deletedCount: result.deletedCount,
	});
});

/**
 * @desc    Get reading statistics
 * @route   GET /api/v1/user/reading-history/stats
 * @access  Private
 */
export const getReadingStats = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	const stats = await getUserReadingStats(userId);

	res.status(200).json({
		success: true,
		data: stats,
	});
});
