import Comment from "../models/comment.model.js";

export const addNewsComment = async (userId, newsId, content) => {
	return await Comment.create({ user: userId, news: newsId, content });
};

export const getNewsComments = async (newsId) => {
	return await Comment.find({ news: newsId, isApproved: true })
		.populate("user", "username avatar")
		.sort("-createdAt");
};
