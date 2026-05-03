import User from "../models/User.model.js";
import { ErrorResponse } from "../utils/errorResponse.util.js";

export const registerUser = async (userData) => {
	const { email } = userData;
	const existingUser = await User.findOne({ email });
	if (existingUser) throw new ErrorResponse("User already exists", 400);

	return await User.create(userData);
};

export const validateAdmin = async (email, password) => {
	const user = await User.findOne({ email, role: "admin" }).select("+password");
	if (!user || !(await user.matchPassword(password))) {
		throw new ErrorResponse("Invalid admin credentials", 401);
	}
	return user;
};
