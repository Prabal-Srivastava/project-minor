import Joi from "joi";

// Ensure this name matches exactly what the route is looking for
export const registerSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
	bio: Joi.string().max(250).optional(),
});

export const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
	email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
	password: Joi.string().min(8).required(),
});