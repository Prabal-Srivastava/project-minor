import { asyncHandler } from "../../utils/asyncHandler.util.js";
import User from "../../models/User.model.js";
import Comment from "../../models/comment.model.js";
import Bookmark from "../../models/Bookmark.model.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
	const totalUsers = await User.countDocuments({ role: "user" });
	const totalComments = await Comment.countDocuments();
	const totalBookmarks = await Bookmark.countDocuments();

	// Count distinct external articles we have any data for
	const commentArticles = await Comment.distinct("articleUrl");
	const bookmarkArticles = await Bookmark.distinct("articleUrl");
	const uniqueArticles = new Set([
		...commentArticles.filter(Boolean),
		...bookmarkArticles.filter(Boolean),
	]);

	res.status(200).json({
		success: true,
		data: {
			totalArticles: uniqueArticles.size,
			totalUsers,
			totalComments,
			totalBookmarks,
		},
	});
});
