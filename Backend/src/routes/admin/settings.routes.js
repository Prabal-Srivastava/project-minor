import express from "express";
import { getSettings, updateSettings } from "../../controllers/admin/settings.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", getSettings); // Public route to get settings
router.put("/", protect, adminOnly, updateSettings);

export default router;
