import SiteSettings from "../models/SiteSettings.model.js";

export const getSiteSettings = async () => {
	return (await SiteSettings.findOne()) || (await SiteSettings.create({}));
};

export const updateSiteSettings = async (data) => {
	return await SiteSettings.findOneAndUpdate({}, data, {
		new: true,
		upsert: true,
	});
};
