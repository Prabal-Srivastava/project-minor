import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
	{
		siteName: { type: String, default: "Global News Portal" },
		logoUrl: { type: String },
		contactEmail: { type: String },
		socialLinks: {
			facebook: String,
			twitter: String,
			instagram: String,
		},
		maintenanceMode: { type: Boolean, default: false },
		footerText: { type: String },
	},
	{ timestamps: true }
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
export default SiteSettings;
