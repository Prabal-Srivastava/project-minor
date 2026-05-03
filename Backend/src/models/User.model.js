import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true, select: false },
		role: { type: String, enum: ["user", "editor", "admin"], default: "user" },
		avatar: { type: String, default: "" },
		status: { type: String, enum: ["active", "suspended"], default: "active" },
		bio: { type: String, maxlength: 250 },
		resetPasswordToken: { type: String },
		resetPasswordExpire: { type: Date },
		
		// Subscription & Monetization
		subscriptionTier: { 
			type: String, 
			enum: ["free", "premium"], 
			default: "free" 
		},
		subscriptionStatus: { 
			type: String, 
			enum: ["active", "cancelled", "expired", "trial"], 
			default: "active" 
		},
		subscriptionStartDate: { type: Date },
		subscriptionEndDate: { type: Date },
		stripeCustomerId: { type: String },
		stripeSubscriptionId: { type: String },
		
		// Article Limits (for free tier)
		dailyArticleCount: { type: Number, default: 0 },
		lastArticleResetDate: { type: Date, default: Date.now },
		
		// Newsletter
		newsletterSubscribed: { type: Boolean, default: false },
		newsletterFrequency: { 
			type: String, 
			enum: ["daily", "weekly", "none"], 
			default: "none" 
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
