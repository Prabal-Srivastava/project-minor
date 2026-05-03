import User from "../models/User.model.js";

export const updateUserStatus = async (userId, status) => {
	return await User.findByIdAndUpdate(userId, { status }, { new: true });
};

export const getAllUsersAdmin = async () => {
	return await User.find().select("-password").sort("-createdAt");
};
