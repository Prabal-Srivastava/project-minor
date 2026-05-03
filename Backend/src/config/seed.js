import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import Category from "../models/category.model.js";

dotenv.config();

const seedData = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);

		// 1. Clear existing data (Optional - use with caution)
		// await User.deleteMany();
		// await Category.deleteMany();

		// 2. Seed Default Categories
		const categories = [
			{ name: "Top",           slug: "top",           order: 1 },
			{ name: "Politics",      slug: "politics",      order: 2 },
			{ name: "Business",      slug: "business",      order: 3 },
			{ name: "Technology",    slug: "technology",    order: 4 },
			{ name: "Sports",        slug: "sports",        order: 5 },
			{ name: "Entertainment", slug: "entertainment", order: 6 },
			{ name: "Health",        slug: "health",        order: 7 },
			{ name: "Science",       slug: "science",       order: 8 },
			{ name: "World",         slug: "world",         order: 9 },
			{ name: "Crime",         slug: "crime",         order: 10 },
		];
		await Category.insertMany(categories);
		console.log("✅ Categories Seeded");
		const existingCategories = await Category.countDocuments();
		if (existingCategories === 0) {
			await Category.insertMany(categories);
			console.log("✅ Categories Seeded");
		} else {
			console.log("⚠️  Categories already exist, skipping...");
		}
		// 3. Seed Default Admin
		const adminExists = await User.findOne({ role: "admin" });
		if (!adminExists) {
			await User.create({
				username: "admin_master",
				email: "admin@newsportal.com",
				password: "AdminPassword123", // Will be hashed by model middleware
				role: "admin",
			});
			console.log("✅ Admin User Seeded");
		}

		console.log("🌟 Seeding Complete!");
		process.exit();
	} catch (error) {
		console.error(`❌ Seeding Error: ${error.message}`);
		process.exit(1);
	}
};

seedData();
