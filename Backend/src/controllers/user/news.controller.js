import News from "../../models/News.model.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ErrorResponse } from "../../utils/errorResponse.util.js";
import { fetchTopHeadlines } from "../../services/newsApi.service.js";

// Make sure 'export' is here!
export const getAllNews = asyncHandler(async (req, res) => {
	const { category, search } = req.query;
	
	// Build query
	let query = { status: "published" };

	// Filter by category
	if (category) {
		// Check if category is a valid ObjectId
		if (/^[0-9a-fA-F]{24}$/.test(category)) {
			query.category = category;
		}
	}

	// Search by keyword in title or content
	if (search) {
		query.$or = [
			{ title: { $regex: search, $options: "i" } },
			{ content: { $regex: search, $options: "i" } },
			{ excerpt: { $regex: search, $options: "i" } },
		];
	}

	const news = await News.find(query)
		.populate("author", "username")
		.populate("category", "name")
		.sort("-createdAt");

	res.status(200).json({
		success: true,
		count: news.length,
		data: news,
	});
});

// Make sure 'export' is here!
export const getSingleNews = asyncHandler(async (req, res) => {
	const { slug } = req.params;
	
	// Try to find by slug first, then by ID if slug doesn't match
	let query = { status: "published" };
	
	// Check if it's a valid MongoDB ObjectId (24 hex characters)
	if (/^[0-9a-fA-F]{24}$/.test(slug)) {
		query._id = slug;
	} else {
		query.slug = slug;
	}

	const news = await News.findOneAndUpdate(
		query,
		{ $inc: { views: 1 } },
		{ new: true }
	).populate("author", "username email").populate("category", "name");

	if (!news) {
		throw new ErrorResponse("News article not found", 404);
	}

	res.status(200).json({ success: true, data: news });
});

export const getExternalNews = asyncHandler(async (req, res) => {
	const { q, country, page, pageSize, category } = req.query;

	const data = await fetchTopHeadlines({
		q,
		category,
		country: country || "us",
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
