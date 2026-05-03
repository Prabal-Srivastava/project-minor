import { ErrorResponse } from "../utils/errorResponse.util.js";

export const checkAccountStatus = (req, res, next) => {
	if (req.user && req.user.status === "suspended") {
		return next(
			new ErrorResponse(
				"Your account is suspended. Please contact support.",
				403
			)
		);
	}
	next();
};
