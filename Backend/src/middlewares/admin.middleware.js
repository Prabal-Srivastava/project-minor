import { ErrorResponse } from "../utils/errorResponse.util.js";

export const adminOnly = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		next(new ErrorResponse("Access denied: Admins only", 403));
	}
};
