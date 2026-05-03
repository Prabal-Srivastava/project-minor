import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
	{
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		action: { type: String, required: true }, // e.g., "Deleted User", "Updated Settings"
		target: { type: String }, // ID or name of the affected entity
		details: { type: Object },
		ipAddress: { type: String },
	},
	{ timestamps: true }
);

const AdminLog = mongoose.model("AdminLog", adminLogSchema);
export default AdminLog;
