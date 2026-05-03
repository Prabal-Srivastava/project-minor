import Joi from "joi";

// Ensure the export name is categorySchema
export const categorySchema = Joi.object({
	name: Joi.string().min(2).max(50).required(),
	description: Joi.string().max(200).optional(),
	order: Joi.number().integer().min(0).optional(),
});
