import upload from "../config/upload.js";
import { ErrorResponse } from "../utils/errorResponse.util.js";

export const uploadSingle = (fieldName) => {
	return (req, res, next) => {
		const uploadProcess = upload.single(fieldName);

		uploadProcess(req, res, (err) => {
			// Allow request to continue if no file is uploaded (file is optional)
			// Multer errors: LIMIT_UNEXPECTED_FILE means field not found (which is OK for optional)
			if (err) {
				if (err.code === "LIMIT_UNEXPECTED_FILE" || err.message.includes("Unexpected field")) {
					// Field not found, but that's OK - file is optional
					return next();
				}
				return next(new ErrorResponse(err.message, 400));
			}
			next();
		});
	};
};
