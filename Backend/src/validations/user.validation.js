import Joi from "joi";

export const updateProfileSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).optional(),
	email: Joi.string().email().optional(),
	bio: Joi.string().max(250).optional(),
	avatar: Joi.string().optional(),
});

export const adminUserUpdateSchema = Joi.object({
	role: Joi.string().valid("user", "editor", "admin").optional(),
	status: Joi.string().valid("active", "suspended").optional(),
});
