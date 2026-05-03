import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { fetchTopHeadlines } from "../../services/newsApi.service.js";
import { fetchFullArticleContent } from "../../services/articleContent.service.js";

export const getExternalNews = asyncHandler(async (req, res) => {
	const { q, country, page, pageSize, category } = req.query;

	const data = await fetchTopHeadlines({
		q,
		category,
		country: country || "in",
		page,
		pageSize,
	});

	res.status(200).json({
		success: true,
		source: "newsapi",
		totalResults: data.totalResults,
		articles: data.articles,
	});
});

export const getFullArticleContent = asyncHandler(async (req, res) => {
	const { url } = req.query;

	if (!url) {
		return res.status(400).json({ success: false, message: "Article URL is required" });
	}

	const fullContent = await fetchFullArticleContent(url);

	if (!fullContent || fullContent.length < 200) {
		return res.status(404).json({
			success: false,
			message: "Could not extract full article content",
			content: fullContent || "",
		});
	}

	res.status(200).json({
		success: true,
		url,
		content: fullContent,
		contentLength: fullContent.length,
	});
});
