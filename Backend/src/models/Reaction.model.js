import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		news: { type: mongoose.Schema.Types.ObjectId, ref: "News", required: true },
		type: { type: String, enum: ["like", "dislike", "love"], required: true },
	},
	{ timestamps: true }
);

reactionSchema.index({ user: 1, news: 1 }, { unique: true });

const Reaction = mongoose.model("Reaction", reactionSchema);
export default Reaction;
