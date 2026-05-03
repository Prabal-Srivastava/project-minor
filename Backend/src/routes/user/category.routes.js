import express from "express";
import { getCategories } from "../../controllers/admin/category.controller.js";

const router = express.Router();

router.get("/", getCategories); // Public route to see categories

export default router;
