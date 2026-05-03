import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		// External article URL this bookmark points to
		articleUrl: { type: String, required: true, maxlength: 2048 },
		// Cached metadata for displaying in bookmarks list
		title: { type: String },
		description: { type: String },
		imageUrl: { type: String },
		sourceName: { type: String },
		publishedAt: { type: Date },
	},
	{ timestamps: true }
);

bookmarkSchema.index({ user: 1, articleUrl: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;
