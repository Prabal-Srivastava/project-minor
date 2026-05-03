import express from "express";
import {
	getCommentsByNews,
	addComment,
	updateComment,
	deleteComment,
} from "../../controllers/user/comment.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { commentSchema } from "../../validations/comment.validation.js";

const router = express.Router();

router.get("/news/:newsId", getCommentsByNews);
router.post("/:newsId", protect, validate(commentSchema), addComment);
router.put("/:id", protect, validate(commentSchema), updateComment);
router.delete("/:id", protect, deleteComment);

export default router;
