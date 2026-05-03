import express from "express";
import {
	register,
	login,
	logout,
	forgotPassword,
	resetPassword,
} from "../../controllers/user/auth.controller.js";
import { authLimiter } from "../../middlewares/rateLimit.middleware.js";

import { validate } from "../../middlewares/validate.middleware.js";
import {
	registerSchema,
	loginSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
} from "../../validations/auth.validation.js";

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", authLimiter, validate(resetPasswordSchema), resetPassword);

export default router;
