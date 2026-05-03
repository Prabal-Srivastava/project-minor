import { asyncHandler } from "../../utils/asyncHandler.util.js";
import Category from "../../models/category.model.js";
import News from "../../models/News.model.js";
import { ErrorResponse } from "../../utils/errorResponse.util.js";
import slugify from "slugify";

export const createCategory = asyncHandler(async (req, res) => {
	const { name, description, order } = req.body;
	const slug = slugify(name, { lower: true });

	const category = await Category.create({ name, slug, description, order });

	res.status(201).json({ success: true, data: category });
});

export const getCategories = asyncHandler(async (req, res) => {
	const categories = await Category.find().sort("order");
	res.status(200).json({ success: true, data: categories });
});

export const updateCategory = asyncHandler(async (req, res) => {
	const { name, description, order } = req.body;
	
	let updateData = { description, order };
	
	// Update slug if name changed
	if (name) {
		updateData.name = name;
		updateData.slug = slugify(name, { lower: true });
	}

	const category = await Category.findByIdAndUpdate(
		req.params.id,
		updateData,
		{ new: true, runValidators: true }
	);

	if (!category) {
		throw new ErrorResponse("Category not found", 404);
	}

	res.status(200).json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id);

	if (!category) {
		throw new ErrorResponse("Category not found", 404);
	}

	// Check if category has news articles
	const newsCount = await News.countDocuments({ category: category._id });

	if (newsCount > 0) {
		throw new ErrorResponse(
			`Cannot delete category. It has ${newsCount} news article(s) associated with it.`,
			400
		);
	}

	await category.deleteOne();

	res.status(200).json({ success: true, message: "Category deleted successfully" });
});
