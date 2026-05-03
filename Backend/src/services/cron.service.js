import cron from "node-cron";
import { sendNewsletter } from "./newsletter.service.js";

export const initializeCronJobs = () => {
	// Daily newsletter at 8:00 AM IST
	cron.schedule(
		"0 8 * * *",
		async () => {
			try {
				await sendNewsletter("daily");
			} catch {
				// cron errors are non-fatal
			}
		},
		{ scheduled: true, timezone: "Asia/Kolkata" }
	);

	// Weekly newsletter at 8:00 AM every Monday
	cron.schedule(
		"0 8 * * 1",
		async () => {
			try {
				await sendNewsletter("weekly");
			} catch {
				// cron errors are non-fatal
			}
		},
		{ scheduled: true, timezone: "Asia/Kolkata" }
	);
};
