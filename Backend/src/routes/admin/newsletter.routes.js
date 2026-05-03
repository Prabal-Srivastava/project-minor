import express from "express";
import { sendNewsletterManually } from "../../controllers/user/newsletter.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";

const router = express.Router();

// Admin only endpoints
router.use(protect, adminOnly);

router.post("/send", sendNewsletterManually);

export default router;
