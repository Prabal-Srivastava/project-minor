import News from "../models/News.model.js";
import User from "../models/User.model.js";
import Comment from "../models/comment.model.js";

export const getSystemStats = async () => {
	const [newsCount, userCount, commentCount] = await Promise.all([
		News.countDocuments(),
		User.countDocuments({ role: "user" }),
		Comment.countDocuments(),
	]);

	const viewStats = await News.aggregate([
		{ $group: { _id: null, totalViews: { $sum: "$views" } } },
	]);

	return {
		news: newsCount,
		users: userCount,
		comments: commentCount,
		views: viewStats[0]?.totalViews || 0,
	};
};
