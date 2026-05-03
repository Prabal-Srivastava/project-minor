import express from "express";
import {
	getSubscriptionStatus,
	getPricing,
	createCheckout,
	subscriptionSuccess,
	getDetails,
	cancel,
	getArticleLimit,
} from "../../controllers/user/subscription.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public endpoints
router.get("/status", getSubscriptionStatus);
router.get("/pricing", getPricing);

// Protected endpoints (require authentication)
router.use(protect);

router.post("/checkout", createCheckout);
router.post("/success", subscriptionSuccess);
router.get("/details", getDetails);
router.post("/cancel", cancel);
router.get("/article-limit", getArticleLimit);

export default router;
