import express from "express";
import { getExternalNews, getFullArticleContent } from "../../controllers/visitor/news.controller.js";
import { getAllNews, getSingleNews } from "../../controllers/user/news.controller.js";
import { getCommentsByNewsId, addCommentToNews } from "../../controllers/user/comment.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkArticleAccess, trackArticleView } from "../../middlewares/articleLimit.middleware.js";

const router = express.Router();

// External news with article limit check
router.get("/external", protect, getExternalNews);
router.get("/external/full-content", protect, checkArticleAccess, trackArticleView, getFullArticleContent);

router.get("/", getAllNews);
router.get("/:slug", getSingleNews);
router.get("/:newsId/comments", getCommentsByNewsId);
router.post("/:newsId/comments", protect, addCommentToNews);

export default router;