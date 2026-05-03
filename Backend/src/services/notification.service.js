import Notification from "../models/Notification.model.js";

export const createNotification = async (
	recipientId,
	type,
	message,
	link = ""
) => {
	return await Notification.create({
		recipient: recipientId,
		type,
		message,
		link,
	});
};

export const getUserNotifications = async (userId) => {
	return await Notification.find({ recipient: userId }).sort("-createdAt");
};
