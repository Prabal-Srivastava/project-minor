import SiteSettings from "../../models/SiteSettings.model.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";

export const getSettings = asyncHandler(async (req, res) => {
	let settings = await SiteSettings.findOne();
	
	// If no settings exist, return default settings
	if (!settings) {
		settings = await SiteSettings.create({});
	}
	
	res.status(200).json({ success: true, data: settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
	let settings = await SiteSettings.findOne();
	if (!settings) {
		settings = await SiteSettings.create(req.body);
	} else {
		settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, {
			new: true,
			runValidators: true,
		});
	}
	res.status(200).json({ success: true, data: settings });
});
