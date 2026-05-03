import express from "express";
import {
	getAllNews,
	createNews,
	updateNews,
	updateNewsStatus,
	deleteNews,
	getExternalNews,
	importExternalNews,
} from "../../controllers/admin/news.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { uploadSingle } from "../../middlewares/upload.middleware.js";

const router = express.Router();

// Specific routes must come before parameterized routes to avoid conflicts
router.get("/external", protect, adminOnly, getExternalNews);
router.post("/import", protect, adminOnly, importExternalNews);

// Internal news CRUD
router.get("/", protect, adminOnly, getAllNews);
router.post("/", protect, adminOnly, uploadSingle("featuredImage"), createNews);
router.put("/:id", protect, adminOnly, uploadSingle("featuredImage"), updateNews);
router.patch("/:id/status", protect, adminOnly, updateNewsStatus);
router.delete("/:id", protect, adminOnly, deleteNews);

export default router;
