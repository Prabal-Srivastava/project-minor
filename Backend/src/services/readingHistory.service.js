import ReadingHistory from "../models/ReadingHistory.model.js";

export const addToReadingHistory = async (userId, articleData) => {
	const { articleUrl, title, description, imageUrl, sourceName, publishedAt } = articleData;
	const existing = await ReadingHistory.findOne({ user: userId, articleUrl });

	if (existing) {
		existing.readCount += 1;
		existing.lastReadAt = new Date();
		if (title) existing.title = title;
		if (description) existing.description = description;
		if (imageUrl) existing.imageUrl = imageUrl;
		if (sourceName) existing.sourceName = sourceName;
		if (publishedAt) existing.publishedAt = publishedAt;
		await existing.save();
		return existing;
	}

	return ReadingHistory.create({
		user: userId, articleUrl, title, description,
		imageUrl, sourceName, publishedAt,
		readAt: new Date(), lastReadAt: new Date(), readCount: 1,
	});
};

export const getUserReadingHistory = async (userId, options = {}) => {
	const { page = 1, limit = 20, sortBy = "lastReadAt" } = options;
	const skip = (page - 1) * limit;
	const [history, total] = await Promise.all([
		ReadingHistory.find({ user: userId }).sort({ [sortBy]: -1 }).skip(skip).limit(limit).lean(),
		ReadingHistory.countDocuments({ user: userId }),
	]);
	return { history, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const hasUserReadArticle = async (userId, articleUrl) => {
	const h = await ReadingHistory.findOne({ user: userId, articleUrl });
	return !!h;
};

export const deleteReadingHistoryEntry = async (userId, articleUrl) =>
	ReadingHistory.findOneAndDelete({ user: userId, articleUrl });

export const clearUserReadingHistory = async (userId) =>
	ReadingHistory.deleteMany({ user: userId });

export const getUserReadingStats = async (userId) => {
	const [totalArticles, totalReadsAgg, recentHistory] = await Promise.all([
		ReadingHistory.countDocuments({ user: userId }),
		ReadingHistory.aggregate([
			{ $match: { user: userId } },
			{ $group: { _id: null, total: { $sum: "$readCount" } } },
		]),
		ReadingHistory.find({ user: userId }).sort({ lastReadAt: -1 }).limit(5).lean(),
	]);
	return { totalArticles, totalReads: totalReadsAgg[0]?.total || 0, recentHistory };
};
