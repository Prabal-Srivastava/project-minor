import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { ErrorResponse } from "../utils/errorResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

export const protect = asyncHandler(async (req, res, next) => {
	let token;

	// Check for token in Authorization header (Bearer token)
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1];
	}
	// Fallback to cookie
	else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		throw new ErrorResponse("Not authorized, please login", 401);
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.userId).select("-password");

		if (!req.user) {
			throw new ErrorResponse("User no longer exists", 401);
		}

		next();
	} catch (error) {
		throw new ErrorResponse("Token invalid or expired", 401);
	}
});
