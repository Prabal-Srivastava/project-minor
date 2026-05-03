import User from "../../models/User.model.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ErrorResponse } from "../../utils/errorResponse.util.js";

/**
 * @desc    Get all users (with search and role filter)
 * @route   GET /api/admin/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
	const { role, search } = req.query;
	let query = {};

	// Filter by role if provided
	if (role) {
		query.role = role;
	}

	// Search by username or email
	if (search) {
		query.$or = [
			{ username: { $regex: search, $options: "i" } },
			{ email: { $regex: search, $options: "i" } },
		];
	}

	const users = await User.find(query)
		.select("-password") // Never send passwords to frontend
		.sort({ createdAt: -1 });

	res.status(200).json({
		success: true,
		count: users.length,
		data: users,
	});
});

/**
 * @desc    Update user role or status (Ban/Unban)
 * @route   PUT /api/admin/users/:id
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
	const { role, status } = req.body;

	const user = await User.findById(req.params.id);
	if (!user) {
		throw new ErrorResponse("User not found", 404);
	}

	// Prevent admin from deactivating themselves
	if (user._id.toString() === req.user._id.toString()) {
		throw new ErrorResponse("You cannot change your own status", 400);
	}

	const updateData = {};
	if (role) updateData.role = role;
	if (status) updateData.status = status;

	const updatedUser = await User.findByIdAndUpdate(
		req.params.id,
		updateData,
		{ new: true, runValidators: true }
	).select("-password");

	res.status(200).json({ success: true, data: updatedUser });
});

/**
 * @desc    Delete a user account
 * @route   DELETE /api/admin/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		throw new ErrorResponse("User not found", 404);
	}

	// Prevent admin from deleting themselves
	if (user._id.toString() === req.user._id.toString()) {
		throw new ErrorResponse("You cannot delete your own account", 400);
	}

	await user.deleteOne();
	res.status(200).json({ success: true, message: "User deleted successfully" });
});
