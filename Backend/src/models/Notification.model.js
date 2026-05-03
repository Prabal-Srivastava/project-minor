import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		type: { type: String, enum: ["comment", "system", "news"], required: true },
		message: { type: String, required: true },
		isRead: { type: Boolean, default: false },
		link: { type: String }, // e.g., URL to the specific news or comment
	},
	{ timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
