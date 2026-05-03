import { ErrorResponse } from "../utils/errorResponse.util.js";

export const authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(`User role ${req.user.role} is not authorized`, 403)
			);
		}
		next();
	};
};
