import Joi from "joi";

export const commentSchema = Joi.object({
	content: Joi.string().min(2).max(500).required(),
});
