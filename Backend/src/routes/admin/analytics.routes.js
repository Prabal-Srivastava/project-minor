import express from "express";
import { getDashboardStats } from "../../controllers/admin/analytics.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getDashboardStats);
router.get("/stats", protect, adminOnly, getDashboardStats); // Keep for backward compatibility

export default router;
