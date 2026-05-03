import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ErrorResponse } from "../utils/errorResponse.util.js";
import { checkArticleLimit, incrementArticleCount } from "../services/subscription.service.js";

/**
 * Check if user can access article (article limit middleware)
 */
export const checkArticleAccess = asyncHandler(async (req, res, next) => {
	// Check article limit
	const limit = await checkArticleLimit(req.user._id);

	if (!limit.allowed) {
		throw new ErrorResponse(
			`Daily article limit reached. You have read ${limit.limit} articles today. Upgrade to Premium for unlimited access.`,
			403
		);
	}

	// Attach limit info to request for use in response
	req.articleLimit = limit;

	next();
});

/**
 * Track article view (increment count for free users)
 */
export const trackArticleView = asyncHandler(async (req, res, next) => {
	// Increment article count after successful response
	res.on("finish", async () => {
		if (res.statusCode === 200) {
			try {
				await incrementArticleCount(req.user._id);
			} catch {
				// non-fatal — tracking failure should not affect the response
			}
		}
	});

	next();
});
