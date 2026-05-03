import express from "express";
import {
	createCategory,
	getCategories,
	updateCategory,
	deleteCategory,
} from "../../controllers/admin/category.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { categorySchema } from "../../validations/category.validation.js";

const router = express.Router();

router
	.route("/")
	.get(protect, adminOnly, getCategories)
	.post(protect, adminOnly, validate(categorySchema), createCategory);

router
	.route("/:id")
	.put(protect, adminOnly, validate(categorySchema), updateCategory)
	.delete(protect, adminOnly, deleteCategory);

export default router;
