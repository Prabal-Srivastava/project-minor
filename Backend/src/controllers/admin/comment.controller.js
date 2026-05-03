import Comment from "../../models/comment.model.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ErrorResponse } from "../../utils/errorResponse.util.js";

/**
 * @desc    Get all comments (Admin View)
 * @route   GET /api/admin/comments
 */
export const getAllComments = asyncHandler(async (req, res) => {
	// Fetch all comments, sorting by newest first
	// We populate 'user' to see the author; articleUrl is stored directly on the comment
	const comments = await Comment.find()
		.populate("user", "username email")
		.sort({ createdAt: -1 });

	res.status(200).json({
		success: true,
		count: comments.length,
		data: comments,
	});
});

/**
 * @desc    Approve or reject a comment
 * @route   PUT /api/admin/comments/:id/approve
 */
export const approveComment = asyncHandler(async (req, res) => {
	const { isApproved } = req.body;

	const comment = await Comment.findByIdAndUpdate(
		req.params.id,
		{ isApproved },
		{ new: true, runValidators: true }
	)
		.populate("user", "username email");

	if (!comment) {
		throw new ErrorResponse("Comment not found", 404);
	}

	res.status(200).json({
		success: true,
		data: comment,
		message: isApproved ? "Comment approved" : "Comment rejected",
	});
});

/**
 * @desc    Delete any comment (Moderation)
 * @route   DELETE /api/admin/comments/:id
 */
export const deleteComment = asyncHandler(async (req, res) => {
	const comment = await Comment.findById(req.params.id);

	if (!comment) {
		throw new ErrorResponse("Comment not found", 404);
	}

	await comment.deleteOne();

	res.status(200).json({
		success: true,
		message: "Comment removed by administrator",
	});
});

/**
 * @desc    Get comments for a specific article (Admin check)
 * @route   GET /api/admin/comments/news/:newsId
 */
export const getNewsComments = asyncHandler(async (req, res) => {
	// newsId is now an encoded external article URL
	const encoded = req.params.newsId;
	const articleUrl = decodeURIComponent(encoded);

	const comments = await Comment.find({ articleUrl })
		.populate("user", "username email")
		.sort({ createdAt: -1 });

	res.status(200).json({ success: true, data: comments });
});
