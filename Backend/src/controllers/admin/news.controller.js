import { asyncHandler } from "../../utils/asyncHandler.util.js";
import News from "../../models/News.model.js";
import { ErrorResponse } from "../../utils/errorResponse.util.js";
import slugify from "slugify";
import { fetchTopHeadlines } from "../../services/newsApi.service.js";
import { importExternalNews as importExternalNewsService } from "../../services/news.service.js";

export const getAllNews = asyncHandler(async (req, res) => {
	const news = await News.find()
		.populate("author", "username email")
		.populate("category", "name")
		.sort("-createdAt");

	res.status(200).json({
		success: true,
		count: news.length,
		data: news,
	});
});

export const createNews = asyncHandler(async (req, res) => {
	req.body.author = req.user._id;
	req.body.slug = slugify(req.body.title, { lower: true }) + "-" + Date.now();

	// Handle image upload
	if (req.file) {
		req.body.featuredImage = `/uploads/${req.file.filename}`;
	} else if (!req.body.featuredImage) {
		// Set default if no image provided
		req.body.featuredImage = "default-news.jpg";
	}

	const news = await News.create(req.body);
	res.status(201).json({ success: true, data: news });
});

export const updateNews = asyncHandler(async (req, res) => {
	let news = await News.findById(req.params.id);

	if (!news) {
		throw new ErrorResponse("News article not found", 404);
	}

	// Update slug if title changed
	if (req.body.title && req.body.title !== news.title) {
		req.body.slug = slugify(req.body.title, { lower: true }) + "-" + Date.now();
	}

	// Handle image upload
	if (req.file) {
		req.body.featuredImage = `/uploads/${req.file.filename}`;
	} else if (req.body.featuredImage && !req.body.featuredImage.startsWith("/uploads/")) {
		// Keep the URL if it's provided and not a file upload
		// This allows setting featuredImage URL directly
	}

	news = await News.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	}).populate("author category");

	res.status(200).json({ success: true, data: news });
});

export const updateNewsStatus = asyncHandler(async (req, res) => {
	const { status } = req.body;

	if (!["draft", "published", "archived"].includes(status)) {
		throw new ErrorResponse("Invalid status. Must be draft, published, or archived", 400);
	}

	const news = await News.findByIdAndUpdate(
		req.params.id,
		{ status },
		{ new: true, runValidators: true }
	).populate("author category");

	if (!news) {
		throw new ErrorResponse("News article not found", 404);
	}

	res.status(200).json({ success: true, data: news });
});

export const getExternalNews = asyncHandler(async (req, res) => {
	const { q, category, country, page, pageSize } = req.query;

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

export const importExternalNews = asyncHandler(async (req, res) => {
	// Check if importing from external API or importing individual article
	const { fromApi, q, category: categoryQuery, country, page, pageSize } = req.body;
	
	if (fromApi) {
		// Import from external API — pass categoryId separately so the service assigns it to articles
		const { categoryId: bulkCategoryId } = req.body;
		const importResult = await importExternalNewsService({
			q,
			category: categoryQuery,
			country,
			page,
			pageSize,
			categoryId: bulkCategoryId,
		});
		res.status(201).json(importResult);
	} else {
		// Import individual article
		const { title, content, description, urlToImage, url, publishedAt, categoryId, isFeatured } = req.body;
		
		if (!title || !categoryId) {
			throw new ErrorResponse("Title and category are required for import", 400);
		}
		
		const finalContent =
			content ||
			description ||
			title + (url ? `\n\nSource: ${url}` : "");
		
		const news = await News.create({
			title,
			slug: slugify(title, { lower: true }) + "-" + Date.now(),
			content: finalContent,
			excerpt: description || finalContent?.slice(0, 200),
			author: req.user._id,
			category: categoryId, // renamed to avoid conflict with query param
			featuredImage: urlToImage || "default-news.jpg",
			status: "published",
			isFeatured: !!isFeatured,
		});
		
		res.status(201).json({ success: true, data: news });
	}
});

export const deleteNews = asyncHandler(async (req, res) => {
	const news = await News.findByIdAndDelete(req.params.id);
	
	if (!news) {
		throw new ErrorResponse("News article not found", 404);
	}

	res.status(200).json({ success: true, message: "News deleted successfully" });
});
