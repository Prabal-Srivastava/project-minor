import { ErrorResponse } from "../utils/errorResponse.util.js";

export const notFound = (req, res, next) => {
	const error = new ErrorResponse(`Route Not Found - ${req.originalUrl}`, 404);
	next(error);
};

export const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	// Log for dev
	if (process.env.NODE_ENV === "development") console.error(err);

	// Mongoose Validation Error
	if (err.name === "ValidationError") {
		const message = Object.values(err.errors).map((val) => val.message);
		error = new ErrorResponse(message, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		message: error.message || "Server Error",
	});
};
