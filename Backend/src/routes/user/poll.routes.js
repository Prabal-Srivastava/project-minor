import express from "express";
import { getTodayPoll, getPolls, vote, getResults } from "../../controllers/user/poll.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/today", getTodayPoll);
router.get("/", getPolls);
router.get("/:pollId/results", getResults);

// Protected routes
router.post("/:pollId/vote", protect, vote);

export default router;
