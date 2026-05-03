import Reaction from "../../models/Reaction.model.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";

export const postReaction = asyncHandler(async (req, res) => {
	const { type } = req.body; // e.g., 'like', 'love'
	await Reaction.findOneAndUpdate(
		{ user: req.user._id, news: req.params.newsId },
		{ type },
		{ upsert: true, new: true }
	);
	res.status(200).json({ success: true, message: "Reaction saved" });
});
