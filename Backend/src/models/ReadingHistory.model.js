import mongoose from "mongoose";

const readingHistorySchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		// External article URL
		articleUrl: { type: String, required: true, maxlength: 2048 },
		// Cached metadata for displaying in history
		title: { type: String },
		description: { type: String },
		imageUrl: { type: String },
		sourceName: { type: String },
		publishedAt: { type: Date },
		// Reading metadata
		readAt: { type: Date, default: Date.now },
		readCount: { type: Number, default: 1 }, // How many times user read this article
		lastReadAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

// Index for efficient queries
readingHistorySchema.index({ user: 1, articleUrl: 1 }, { unique: true });
readingHistorySchema.index({ user: 1, lastReadAt: -1 }); // For sorting by recent

const ReadingHistory = mongoose.model("ReadingHistory", readingHistorySchema);
export default ReadingHistory;
