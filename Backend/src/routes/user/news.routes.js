import express from "express";
import { getExternalNews } from "../../controllers/user/news.controller.js";

const router = express.Router();

// User news is external-only now
router.get("/external", getExternalNews);

export default router;
