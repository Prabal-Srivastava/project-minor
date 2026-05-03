import express from "express";
import { postReaction } from "../../controllers/user/reaction.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Reaction endpoint — bookmark endpoints live in /api/v1/user/bookmarks
router.post("/react/:newsId", protect, postReaction);

export default router;
