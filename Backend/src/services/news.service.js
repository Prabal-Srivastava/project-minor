import News from "../models/News.model.js";
import User from "../models/User.model.js";
import Category from "../models/category.model.js";
import { fetchTopHeadlines } from "./newsApi.service.js";
import { fetchFullArticleContent } from "./articleContent.service.js";
import slugify from "slugify";

export const createNewsArticle = async (data) => {
	return await News.create(data);
};

export const fetchPublicNews = async (filters = {}) => {
	const news = await News.find({ status: "published", ...filters })
		.populate("category", "name")
		.populate("author", "username")
		.sort("-createdAt");
	
	// Apply image fallback for each article
	return news.map(article => {
		let featuredImage = article.featuredImage;
		if (!featuredImage || featuredImage.includes('placeholder') || featuredImage.includes('example')) {
			// Generate a placeholder image based on category
			const category = article.category?.name || 'general';
			const categoryColors = {
				'business': '4682B4',
				'entertainment': 'FF6B6B',
				'general': '4ECDC4',
				'health': '45B7D1',
				'science': '96CEB4',
				'sports': 'FFEAA7',
				'technology': 'DDA0DD',
				'politics': '98D8C8',
				'world': 'F7DC6F',
				'india': 'FF8C42'
			};
			const color = categoryColors[category.toLowerCase()] || categoryColors.general;
			const titleText = encodeURIComponent(article.title.substring(0, 50));
			featuredImage = `https://ui-avatars.com/api/?name=${titleText}&background=${color}&color=fff&size=600`;
		}
		
		// Update the featuredImage in the returned object
		return {
			...article.toObject(),
			featuredImage
		};
	});
};

export const incrementViews = async (slug) => {
	return await News.findOneAndUpdate(
		{ slug },
		{ $inc: { views: 1 } },
		{ new: true }
	);
};

// Function to import external news and save to internal database
export const importExternalNews = async (params = {}) => {
	try {
		const { categoryId, ...fetchParams } = params;
		const externalData = await fetchTopHeadlines(fetchParams);
		const articles = externalData.articles || [];
		
		// Get the first admin user (or regular user if no admin)
		let defaultAuthor = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
		if (!defaultAuthor) {
			defaultAuthor = await User.findOne({}).sort({ createdAt: 1 });
		}
		
		// Use the provided categoryId, or fall back to the first available category
		let defaultCategory;
		if (categoryId) {
			defaultCategory = await Category.findById(categoryId);
		}
		if (!defaultCategory) {
			defaultCategory = await Category.findOne({}).sort({ createdAt: 1 });
		}
		
		// Process each article and save to internal database
		const processedArticles = [];
		for (const article of articles) {
			// Skip if article doesn't have required fields
			if (!article.title || !article.description) continue;
			
			// Only import articles that have valid images (not null, not placeholder, not example)
			if (!article.urlToImage || article.urlToImage.includes('placeholder') || article.urlToImage.includes('example') || article.urlToImage.trim() === '') {
				continue;
			}
			
			// Create a slug from the title
			let baseSlug = slugify(article.title, { lower: true, strict: true });
			
			// Check if article already exists in our database
			const existingArticle = await News.findOne({ slug: new RegExp(`^${baseSlug}(-\d+)?$`) });
			if (existingArticle) continue; // Skip if already exists
			
			// Attempt to fetch full content from the original article URL
			let fullContent = article.content || article.description;
			if (article.url) {
				try {
					const fullArticleContent = await fetchFullArticleContent(article.url);
					if (fullArticleContent) fullContent = fullArticleContent;
				} catch {
					fullContent = article.content || article.description;
				}
			}
			
			// Use the original image URL since we've already validated it
			const featuredImage = article.urlToImage;
			
			// Create internal news article
			const internalArticle = {
				title: article.title,
				slug: `${baseSlug}-${Date.now()}`, // Add timestamp to ensure uniqueness
				content: fullContent,
				excerpt: article.description,
				featuredImage: featuredImage,
				status: "published", // Set as published to be visible
				views: 0,
				tags: [],
				isFeatured: false,
				author: defaultAuthor ? defaultAuthor._id : null,
				category: defaultCategory ? defaultCategory._id : null,
			};
			
			try {
				const savedArticle = await News.create(internalArticle);
				processedArticles.push(savedArticle);
			} catch {
				// skip failed articles
			}
		}
		
		return {
			success: true,
			count: processedArticles.length,
			articles: processedArticles
		};
	} catch (error) {
		throw error;
	}
};
