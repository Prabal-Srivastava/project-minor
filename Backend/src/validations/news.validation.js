import Joi from "joi";

export const newsSchema = Joi.object({
	title: Joi.string().min(10).max(200).required(),
	content: Joi.string().min(50).required(),
	excerpt: Joi.string().max(300).optional(),
	category: Joi.string().hex().length(24).required(),
	featuredImage: Joi.string().allow("").optional(),
	status: Joi.string().valid("draft", "published", "archived").default("draft"),
	tags: Joi.array().items(Joi.string().max(20)).optional(),
	isFeatured: Joi.boolean().default(false).optional(),
});
