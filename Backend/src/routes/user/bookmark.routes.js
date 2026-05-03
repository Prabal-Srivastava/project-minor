import express from "express";
import { getBookmarks, toggleBookmark } from "../../controllers/user/bookmark.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getBookmarks);
router.post("/:newsId", protect, toggleBookmark);

export default router;
