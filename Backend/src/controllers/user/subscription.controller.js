import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ErrorResponse } from "../../utils/errorResponse.util.js";
import Stripe from "stripe";
import env from "../../config/env.js";
import User from "../../models/User.model.js";
import Subscription from "../../models/Subscription.model.js";
import {
	isStripeAvailable,
	createCheckoutSession,
	handleSubscriptionSuccess,
	cancelSubscription,
	getSubscriptionDetails,
	checkArticleLimit,
	PRICING,
} from "../../services/subscription.service.js";

/**
 * Get subscription status
 * @route GET /api/v1/user/subscription/status
 */
export const getSubscriptionStatus = asyncHandler(async (req, res) => {
	const available = isStripeAvailable();

	res.status(200).json({
		success: true,
		stripeAvailable: available,
		message: available
			? "Subscription features are enabled"
			: "Subscription features disabled. Configure STRIPE_SECRET_KEY to enable.",
	});
});

/**
 * Get pricing information
 * @route GET /api/v1/user/subscription/pricing
 */
export const getPricing = asyncHandler(async (req, res) => {
	res.status(200).json({
		success: true,
		data: PRICING,
	});
});

/**
 * Create checkout session
 * @route POST /api/v1/user/subscription/checkout
 */
export const createCheckout = asyncHandler(async (req, res) => {
	const { billingCycle = "monthly" } = req.body;

	if (!["monthly", "yearly"].includes(billingCycle)) {
		throw new ErrorResponse("Invalid billing cycle", 400);
	}

	if (!isStripeAvailable()) {
		throw new ErrorResponse("Subscription features are not available", 503);
	}

	const session = await createCheckoutSession(req.user._id, billingCycle);

	res.status(200).json({
		success: true,
		data: {
			sessionId: session.id,
			url: session.url,
		},
	});
});

/**
 * Handle successful subscription
 * @route POST /api/v1/user/subscription/success
 */
export const subscriptionSuccess = asyncHandler(async (req, res) => {
	const { sessionId } = req.body;

	if (!sessionId) {
		throw new ErrorResponse("Session ID is required", 400);
	}

	const subscription = await handleSubscriptionSuccess(sessionId);

	res.status(200).json({
		success: true,
		message: "Subscription activated successfully",
		data: subscription,
	});
});

/**
 * Get user's subscription details
 * @route GET /api/v1/user/subscription/details
 */
export const getDetails = asyncHandler(async (req, res) => {
	const details = await getSubscriptionDetails(req.user._id);

	res.status(200).json({
		success: true,
		data: details,
	});
});

/**
 * Cancel subscription
 * @route POST /api/v1/user/subscription/cancel
 */
export const cancel = asyncHandler(async (req, res) => {
	const { reason } = req.body;

	const result = await cancelSubscription(req.user._id, reason);

	res.status(200).json({
		success: true,
		message: result.message,
	});
});

/**
 * Check article access limit
 * @route GET /api/v1/user/subscription/article-limit
 */
export const getArticleLimit = asyncHandler(async (req, res) => {
	const limit = await checkArticleLimit(req.user._id);

	res.status(200).json({
		success: true,
		data: limit,
	});
});

/**
 * Stripe webhook handler
 * @route POST /api/v1/user/subscription/webhook
 * NOTE: This route must receive the raw body — register it BEFORE express.json()
 */
export const stripeWebhook = async (req, res) => {
	const webhookSecret = env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;

	if (!webhookSecret) {
		return res.status(200).json({ received: true });
	}

	if (!isStripeAvailable()) {
		return res.status(503).json({ error: "Stripe not configured" });
	}

	const stripe = new Stripe(env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY);
	const sig = req.headers["stripe-signature"];

	let event;
	try {
		event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
	} catch (err) {
		return res.status(400).json({ error: `Webhook Error: ${err.message}` });
	}

	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object;
				if (session.payment_status === "paid") {
					await handleSubscriptionSuccess(session.id);
				}
				break;
			}
			case "customer.subscription.deleted": {
				const subscription = event.data.object;
				await User.findOneAndUpdate(
					{ stripeSubscriptionId: subscription.id },
					{ subscriptionTier: "free", subscriptionStatus: "expired" }
				);
				await Subscription.findOneAndUpdate(
					{ stripeSubscriptionId: subscription.id },
					{ status: "expired" }
				);
				break;
			}
			case "invoice.payment_failed":
				// payment failed — could notify user in future
				break;
			default:
				// Unhandled event type — ignore
				break;
		}
	} catch (err) {
		return res.status(500).json({ error: "Webhook processing failed" });
	}

	res.status(200).json({ received: true });
};
