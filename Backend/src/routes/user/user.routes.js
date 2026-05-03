import express from "express";
import {
	getProfile,
	updateProfile,
	changePassword,
} from "../../controllers/user/user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { updateProfileSchema } from "../../validations/user.validation.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/", protect, validate(updateProfileSchema), updateProfile);
router.put("/password", protect, changePassword);

export default router;
