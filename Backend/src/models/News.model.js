import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true },
		content: { type: String, required: true },
		excerpt: { type: String },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		featuredImage: { type: String, default: "default-news.jpg" },
		status: {
			type: String,
			enum: ["draft", "published", "archived"],
			default: "draft",
		},
		views: { type: Number, default: 0 },
		tags: [{ type: String }],
		isFeatured: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

newsSchema.virtual("comments", {
	ref: "Comment",
	localField: "_id",
	foreignField: "news",
	justOne: false,
});

const News = mongoose.model("News", newsSchema);
export default News;
