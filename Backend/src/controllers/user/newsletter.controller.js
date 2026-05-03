import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ErrorResponse } from "../../utils/errorResponse.util.js";
import {
	isEmailAvailable,
	subscribeToNewsletter,
	unsubscribeFromNewsletter,
	sendNewsletter,
} from "../../services/newsletter.service.js";

/**
 * Get newsletter status
 * @route GET /api/v1/user/newsletter/status
 */
export const getNewsletterStatus = asyncHandler(async (req, res) => {
	const available = isEmailAvailable();

	res.status(200).json({
		success: true,
		emailAvailable: available,
		message: available
			? "Newsletter features are enabled"
			: "Newsletter features disabled. Configure email credentials to enable.",
	});
});

/**
 * Subscribe to newsletter
 * @route POST /api/v1/user/newsletter/subscribe
 */
export const subscribe = asyncHandler(async (req, res) => {
	const { email, frequency = "daily" } = req.body;

	if (!email) {
		throw new ErrorResponse("Email is required", 400);
	}

	if (!["daily", "weekly"].includes(frequency)) {
		throw new ErrorResponse("Invalid frequency. Must be 'daily' or 'weekly'", 400);
	}

	const userId = req.user ? req.user._id : null;
	const result = await subscribeToNewsletter(email, userId, frequency);

	res.status(200).json({
		success: result.success,
		message: result.message,
	});
});

/**
 * Unsubscribe from newsletter
 * @route GET /api/v1/user/newsletter/unsubscribe/:token
 */
export const unsubscribe = asyncHandler(async (req, res) => {
	const { token } = req.params;

	if (!token) {
		throw new ErrorResponse("Unsubscribe token is required", 400);
	}

	const result = await unsubscribeFromNewsletter(token);

	res.status(200).json({
		success: result.success,
		message: result.message,
	});
});

/**
 * Send newsletter manually (admin only)
 * @route POST /api/v1/admin/newsletter/send
 */
export const sendNewsletterManually = asyncHandler(async (req, res) => {
	const { frequency = "daily" } = req.body;

	if (!isEmailAvailable()) {
		throw new ErrorResponse("Email is not configured", 503);
	}

	const result = await sendNewsletter(frequency);

	res.status(200).json({
		success: result.success,
		message: `Newsletter sent to ${result.sent} subscribers`,
		data: result,
	});
});
