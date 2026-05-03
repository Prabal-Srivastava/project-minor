import express from "express";
import {
	getNewsletterStatus,
	subscribe,
	unsubscribe,
} from "../../controllers/user/newsletter.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public endpoints — no auth required
router.get("/status", getNewsletterStatus);
router.get("/unsubscribe/:token", unsubscribe);

// Subscribe is public too — visitors can sign up for the newsletter
// If a token is present the controller will attach the user, otherwise it's a guest sub
router.post("/subscribe", (req, res, next) => {
	// Optionally attach user if logged in, but don't block if not
	protect(req, res, (err) => {
		// Ignore auth errors — just proceed without a user
		next();
	});
}, subscribe);

export default router;
