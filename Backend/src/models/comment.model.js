import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		content: { type: String, required: true, maxlength: 500 },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		// Support both internal news articles (by ID) and external articles (by URL)
		news: { type: mongoose.Schema.Types.ObjectId, ref: "News" }, // For internal news articles
		articleUrl: { type: String, maxlength: 2048 }, // For external articles
		isApproved: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

// Add an index to ensure either news or articleUrl is present (but not both)
commentSchema.index({ news: 1, articleUrl: 1 });

// Add a validation to ensure either news or articleUrl is present
commentSchema.pre('validate', function(next) {
  if (!this.news && !this.articleUrl) {
    this.invalidate('news', 'Either news or articleUrl must be provided');
  }
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
