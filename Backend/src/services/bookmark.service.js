import Bookmark from "../models/Bookmark.model.js";

export const toggleUserBookmark = async (userId, newsId) => {
	const existing = await Bookmark.findOne({ user: userId, news: newsId });
	if (existing) {
		await Bookmark.deleteOne({ _id: existing._id });
		return { action: "removed" };
	}
	await Bookmark.create({ user: userId, news: newsId });
	return { action: "added" };
};
