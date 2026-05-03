import Reaction from "../models/Reaction.model.js";

export const upsertReaction = async (userId, newsId, type) => {
	return await Reaction.findOneAndUpdate(
		{ user: userId, news: newsId },
		{ type },
		{ upsert: true, new: true }
	);
};
