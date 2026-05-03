import User from "../../models/User.model.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ErrorResponse } from "../../utils/errorResponse.util.js";
import bcrypt from "bcryptjs";

export const getProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id).select("-password");
	res.status(200).json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
	const { username, email, bio, avatar } = req.body;
	const userId = req.user._id;

	// Check if username or email already exists (excluding current user)
	if (username) {
		const existingUser = await User.findOne({
			username,
			_id: { $ne: userId },
		});
		if (existingUser) {
			throw new ErrorResponse("Username already taken", 400);
		}
	}

	if (email) {
		const existingUser = await User.findOne({
			email: email.toLowerCase(),
			_id: { $ne: userId },
		});
		if (existingUser) {
			throw new ErrorResponse("Email already in use", 400);
		}
		req.body.email = email.toLowerCase();
	}

	const user = await User.findByIdAndUpdate(
		userId,
		{ username, email, bio, avatar },
		{ new: true, runValidators: true }
	).select("-password");

	res.status(200).json({ success: true, data: user });
});

export const changePassword = asyncHandler(async (req, res) => {
	const { currentPassword, newPassword } = req.body;

	if (!currentPassword || !newPassword) {
		throw new ErrorResponse("Please provide current and new password", 400);
	}

	const user = await User.findById(req.user._id).select("+password");

	if (!(await user.matchPassword(currentPassword))) {
		throw new ErrorResponse("Current password is incorrect", 401);
	}

	user.password = newPassword;
	await user.save();

	res.status(200).json({ success: true, message: "Password updated successfully" });
});
