import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
	{
		question: { type: String, required: true, maxlength: 500 },
		options: [
			{
				text: { type: String, required: true, maxlength: 200 },
				votes: { type: Number, default: 0 },
			},
		],
		// Track who voted to prevent duplicate votes
		voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		// Poll metadata
		category: { type: String, enum: ["politics", "sports", "technology", "entertainment", "general"], default: "general" },
		isActive: { type: Boolean, default: true },
		startDate: { type: Date, default: Date.now },
		endDate: { type: Date },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		// Statistics
		totalVotes: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

// Index for efficient queries
pollSchema.index({ isActive: 1, startDate: -1 });
pollSchema.index({ endDate: 1 });

// Method to check if poll is expired
pollSchema.methods.isExpired = function () {
	return this.endDate && new Date() > this.endDate;
};

// Method to get poll results
pollSchema.methods.getResults = function () {
	return this.options.map((option) => ({
		text: option.text,
		votes: option.votes,
		percentage: this.totalVotes > 0 ? ((option.votes / this.totalVotes) * 100).toFixed(1) : 0,
	}));
};

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;
