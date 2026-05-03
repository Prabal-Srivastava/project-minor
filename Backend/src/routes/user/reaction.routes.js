import express from "express";
import { postReaction } from "../../controllers/user/reaction.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:newsId", protect, postReaction);

export default router;
