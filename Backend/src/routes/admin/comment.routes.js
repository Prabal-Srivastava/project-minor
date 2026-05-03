import express from "express";
import {
	getAllComments,
	getNewsComments,
	approveComment,
	deleteComment,
} from "../../controllers/admin/comment.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllComments);
router.get("/news/:newsId", protect, adminOnly, getNewsComments);
router.put("/:id/approve", protect, adminOnly, approveComment);
router.delete("/:id", protect, adminOnly, deleteComment);

export default router;
