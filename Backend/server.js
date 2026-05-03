import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

// Load .env relative to this file — works regardless of cwd
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { initializeCronJobs } from "./src/services/cron.service.js";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		await connectDB();
		initializeCronJobs();

		const server = app.listen(PORT, () => {
			console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
		});

		process.on("unhandledRejection", (err) => {
			console.error(`Error: ${err.message}`);
			server.close(() => process.exit(1));
		});
	} catch (error) {
		console.error("❌ Server failed to start", error);
		process.exit(1);
	}
};

startServer();
