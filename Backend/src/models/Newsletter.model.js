import mongoose from "mongoose";
import crypto from "crypto";

const newsletterSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		frequency: {
			type: String,
			enum: ["daily", "weekly"],
			default: "daily",
		},
		status: {
			type: String,
			enum: ["active", "unsubscribed"],
			default: "active",
		},
		preferences: {
			categories: [String], // Preferred news categories
			sendTime: { type: String, default: "08:00" }, // Preferred send time
		},
		lastSentDate: {
			type: Date,
		},
		unsubscribeToken: {
			type: String,
			unique: true,
		},
	},
	{ timestamps: true }
);

// Generate unsubscribe token before saving
newsletterSchema.pre("save", function (next) {
	if (!this.unsubscribeToken) {
		this.unsubscribeToken = crypto.randomBytes(32).toString("hex");
	}
	next();
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);
export default Newsletter;
