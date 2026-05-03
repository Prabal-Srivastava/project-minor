import express from "express";
import { adminLogin, adminForgotPassword, adminResetPassword } from "../../controllers/admin/auth.controller.js";
import { authLimiter } from "../../middlewares/rateLimit.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { forgotPasswordSchema, resetPasswordSchema } from "../../validations/auth.validation.js";

const router = express.Router();

router.post("/login", authLimiter, adminLogin);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), adminForgotPassword);
router.post("/reset-password/:token", authLimiter, validate(resetPasswordSchema), adminResetPassword);

export default router;
