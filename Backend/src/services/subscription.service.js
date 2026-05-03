import Stripe from "stripe";
import User from "../models/User.model.js";
import Subscription from "../models/Subscription.model.js";
import env from "../config/env.js";

let stripe = null;

const initializeStripe = () => {
	const apiKey = env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
	if (apiKey && apiKey !== "your_stripe_secret_key_here" && apiKey.startsWith("sk_")) {
		try {
			stripe = new Stripe(apiKey);
			return true;
		} catch {
			return false;
		}
	}
	return false;
};

export const isStripeAvailable = () => {
	if (!stripe) initializeStripe();
	return !!stripe;
};

export const PRICING = {
	premium: {
		monthly: { amount: 29900, currency: "inr", interval: "month", name: "Premium Monthly" },
		yearly:  { amount: 299900, currency: "inr", interval: "year",  name: "Premium Yearly"  },
	},
	limits: {
		free:    { dailyArticles: 5,  features: ["Basic news access", "5 articles per day", "Ads displayed"] },
		premium: { dailyArticles: -1, features: ["Unlimited articles", "Ad-free experience", "AI-powered summaries", "Priority support", "Early access to new features"] },
	},
};

export const createStripeCustomer = async (user) => {
	if (!isStripeAvailable()) throw new Error("Stripe is not configured");
	const customer = await stripe.customers.create({
		email: user.email,
		name: user.username,
		metadata: { userId: user._id.toString() },
	});
	await User.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id });
	return customer;
};

export const createCheckoutSession = async (userId, billingCycle = "monthly") => {
	if (!isStripeAvailable()) throw new Error("Stripe is not configured");

	const user = await User.findById(userId);
	if (!user) throw new Error("User not found");

	let customerId = user.stripeCustomerId;
	if (!customerId) {
		const customer = await createStripeCustomer(user);
		customerId = customer.id;
	}

	const pricing = PRICING.premium[billingCycle];
	const session = await stripe.checkout.sessions.create({
		customer: customerId,
		payment_method_types: ["card"],
		line_items: [{
			price_data: {
				currency: pricing.currency,
				product_data: { name: pricing.name, description: `Premium subscription - ${billingCycle}` },
				unit_amount: pricing.amount,
				recurring: { interval: pricing.interval },
			},
			quantity: 1,
		}],
		mode: "subscription",
		success_url: `${env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url:  `${env.CLIENT_URL}/subscription/cancelled`,
		metadata: { userId: userId.toString(), billingCycle },
	});

	return session;
};

export const handleSubscriptionSuccess = async (sessionId) => {
	if (!isStripeAvailable()) throw new Error("Stripe is not configured");

	const session = await stripe.checkout.sessions.retrieve(sessionId);
	const { userId, billingCycle } = session.metadata;

	const startDate = new Date();
	const endDate = new Date();
	if (billingCycle === "yearly") endDate.setFullYear(endDate.getFullYear() + 1);
	else endDate.setMonth(endDate.getMonth() + 1);

	const subscription = await Subscription.create({
		user: userId,
		tier: "premium",
		status: "active",
		startDate,
		endDate,
		stripeCustomerId: session.customer,
		stripeSubscriptionId: session.subscription,
		amount: session.amount_total,
		currency: session.currency,
		billingCycle,
	});

	await User.findByIdAndUpdate(userId, {
		subscriptionTier: "premium",
		subscriptionStatus: "active",
		subscriptionStartDate: startDate,
		subscriptionEndDate: endDate,
		stripeCustomerId: session.customer,
		stripeSubscriptionId: session.subscription,
	});

	return subscription;
};

export const cancelSubscription = async (userId, reason = "") => {
	if (!isStripeAvailable()) throw new Error("Stripe is not configured");

	const user = await User.findById(userId);
	if (!user?.stripeSubscriptionId) throw new Error("No active subscription found");

	await stripe.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: true });

	await Subscription.findOneAndUpdate(
		{ user: userId, status: "active" },
		{ status: "cancelled", cancelledAt: new Date(), cancelReason: reason, autoRenew: false }
	);

	await User.findByIdAndUpdate(userId, { subscriptionStatus: "cancelled" });

	return { success: true, message: "Subscription will be cancelled at period end" };
};

export const checkArticleLimit = async (userId) => {
	const user = await User.findById(userId);
	if (!user) throw new Error("User not found");

	if (user.subscriptionTier === "premium" && user.subscriptionStatus === "active") {
		return { allowed: true, remaining: -1, isPremium: true };
	}

	const today = new Date(); today.setHours(0, 0, 0, 0);
	const lastReset = new Date(user.lastArticleResetDate); lastReset.setHours(0, 0, 0, 0);

	if (today > lastReset) {
		user.dailyArticleCount = 0;
		user.lastArticleResetDate = new Date();
		await user.save();
	}

	const limit = PRICING.limits.free.dailyArticles;
	return {
		allowed: user.dailyArticleCount < limit,
		remaining: Math.max(0, limit - user.dailyArticleCount),
		limit,
		isPremium: false,
	};
};

export const incrementArticleCount = async (userId) => {
	const user = await User.findById(userId);
	if (!user) throw new Error("User not found");

	if (user.subscriptionTier === "premium" && user.subscriptionStatus === "active") return;

	const today = new Date(); today.setHours(0, 0, 0, 0);
	const lastReset = new Date(user.lastArticleResetDate); lastReset.setHours(0, 0, 0, 0);

	if (today > lastReset) {
		user.dailyArticleCount = 1;
		user.lastArticleResetDate = new Date();
	} else {
		user.dailyArticleCount += 1;
	}
	await user.save();
};

export const getSubscriptionDetails = async (userId) => {
	const user = await User.findById(userId);
	if (!user) throw new Error("User not found");

	const subscription = await Subscription.findOne({
		user: userId,
		status: { $in: ["active", "cancelled"] },
	}).sort({ createdAt: -1 });

	return {
		tier: user.subscriptionTier,
		status: user.subscriptionStatus,
		startDate: user.subscriptionStartDate,
		endDate: user.subscriptionEndDate,
		features: PRICING.limits[user.subscriptionTier]?.features || [],
		subscription,
	};
};

initializeStripe();
