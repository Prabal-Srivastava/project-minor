import express from "express";
import {
	getAllUsers,
	updateUserStatus,
	deleteUser,
} from "../../controllers/admin/user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.put("/:id", protect, adminOnly, updateUserStatus);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
