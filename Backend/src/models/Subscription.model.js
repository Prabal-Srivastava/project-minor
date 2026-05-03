import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		tier: {
			type: String,
			enum: ["free", "premium"],
			required: true,
		},
		status: {
			type: String,
			enum: ["active", "cancelled", "expired", "trial"],
			default: "active",
		},
		startDate: {
			type: Date,
			required: true,
			default: Date.now,
		},
		endDate: {
			type: Date,
		},
		stripeCustomerId: {
			type: String,
		},
		stripeSubscriptionId: {
			type: String,
		},
		stripePaymentIntentId: {
			type: String,
		},
		amount: {
			type: Number, // Amount in cents
		},
		currency: {
			type: String,
			default: "inr",
		},
		billingCycle: {
			type: String,
			enum: ["monthly", "yearly"],
			default: "monthly",
		},
		autoRenew: {
			type: Boolean,
			default: true,
		},
		cancelledAt: {
			type: Date,
		},
		cancelReason: {
			type: String,
		},
	},
	{ timestamps: true }
);

// Index for efficient queries
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
