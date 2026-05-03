import Comment from "../../models/comment.model.js";
import News from "../../models/News.model.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ErrorResponse } from "../../utils/errorResponse.util.js";

export const getCommentsByNews = asyncHandler(async (req, res) => {
	// newsId is now an encoded external article URL (encodeURIComponent on frontend)
	const encoded = req.params.newsId;
	const articleUrl = decodeURIComponent(encoded);

	const comments = await Comment.find({ articleUrl, isApproved: true })
		.populate("user", "username email")
		.sort("-createdAt");

	res.status(200).json({ success: true, data: comments });
});

// Function to get comments for internal news articles by news ID
export const getCommentsByNewsId = asyncHandler(async (req, res) => {
	const { newsId } = req.params;

	const comments = await Comment.find({ news: newsId, isApproved: true })
		.populate("user", "username email")
		.sort("-createdAt");

	res.status(200).json({ success: true, data: comments });
});

// Function to add a comment to an internal news article
export const addCommentToNews = asyncHandler(async (req, res) => {
	const { newsId } = req.params;
	const { content } = req.body;

	// Verify the news article exists
	const news = await News.findById(newsId);
	if (!news) {
		throw new ErrorResponse("News article not found", 404);
	}

	const comment = await Comment.create({
		content,
		user: req.user._id,
		news: newsId,
		isApproved: true, // Auto-approve for now, can be modified later
	});
	
	// Populate the user field after creation
	await comment.populate("user", "username");
	
	res.status(201).json({ success: true, data: comment });
});

export const addComment = asyncHandler(async (req, res) => {
	const encoded = req.params.newsId;
	const articleUrl = decodeURIComponent(encoded);

	const comment = await Comment.create({
		content: req.body.content,
		user: req.user._id,
		articleUrl,
	});
	
	// Populate the user field after creation
	await comment.populate("user", "username");
	
	res.status(201).json({ success: true, data: comment });
});

export const updateComment = asyncHandler(async (req, res) => {
	const comment = await Comment.findById(req.params.id);

	if (!comment) {
		throw new ErrorResponse("Comment not found", 404);
	}

	// Check if user owns the comment
	if (comment.user.toString() !== req.user._id.toString()) {
		throw new ErrorResponse("Not authorized to update this comment", 403);
	}

	comment.content = req.body.content;
	await comment.save();

	res.status(200).json({ success: true, data: comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
	const comment = await Comment.findById(req.params.id);

	if (!comment) {
		throw new ErrorResponse("Comment not found", 404);
	}

	// Check if user owns the comment
	if (comment.user.toString() !== req.user._id.toString()) {
		throw new ErrorResponse("Not authorized to delete this comment", 403);
	}

	await comment.deleteOne();

	res.status(200).json({ success: true, message: "Comment deleted successfully" });
});
