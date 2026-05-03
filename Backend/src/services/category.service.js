import Category from "../models/category.model.js";

export const getAllCategories = async () => {
	return await Category.find().sort("order");
};

export const createNewCategory = async (categoryData) => {
	return await Category.create(categoryData);
};
