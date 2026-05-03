import Bookmark from "../../models/Bookmark.model.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";

export const getBookmarks = asyncHandler(async (req, res) => {
	const bookmarks = await Bookmark.find({ user: req.user._id })
		.sort("-createdAt");

	res.status(200).json({
		success: true,
		count: bookmarks.length,
		data: bookmarks,
	});
});

export const toggleBookmark = asyncHandler(async (req, res) => {
	// newsId is now an encoded external article URL (encodeURIComponent on frontend)
	const encoded = req.params.newsId;
	const articleUrl = decodeURIComponent(encoded);

	const query = { user: req.user._id, articleUrl };
	const existing = await Bookmark.findOne(query);

	if (existing) {
		await Bookmark.deleteOne(query);
		res.status(200).json({ success: true, message: "Removed from bookmarks" });
	} else {
		await Bookmark.create({
			...query,
			title: req.body.title,
			description: req.body.description,
			imageUrl: req.body.imageUrl,
			sourceName: req.body.sourceName,
			publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : undefined,
		});
		res.status(201).json({ success: true, message: "Bookmarked successfully" });
	}
});
