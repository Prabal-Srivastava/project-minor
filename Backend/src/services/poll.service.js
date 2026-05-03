import Poll from "../models/Poll.model.js";

export const getPollOfTheDay = async () => {
	const poll = await Poll.findOne({
		isActive: true,
		startDate: { $lte: new Date() },
		$or: [{ endDate: { $gte: new Date() } }, { endDate: null }],
	}).sort({ startDate: -1 }).lean();
	return poll;
};

export const getActivePolls = async (options = {}) => {
	const { page = 1, limit = 10, category } = options;
	const skip = (page - 1) * limit;
	const query = {
		isActive: true,
		startDate: { $lte: new Date() },
		$or: [{ endDate: { $gte: new Date() } }, { endDate: null }],
	};
	if (category) query.category = category;

	const [polls, total] = await Promise.all([
		Poll.find(query).sort({ startDate: -1 }).skip(skip).limit(limit).lean(),
		Poll.countDocuments(query),
	]);
	return { polls, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const voteOnPoll = async (pollId, userId, optionIndex) => {
	const poll = await Poll.findById(pollId);
	if (!poll) throw new Error("Poll not found");
	if (!poll.isActive) throw new Error("Poll is not active");
	if (poll.isExpired()) throw new Error("Poll has expired");
	if (poll.voters.includes(userId)) throw new Error("You have already voted on this poll");
	if (optionIndex < 0 || optionIndex >= poll.options.length) throw new Error("Invalid option");

	poll.options[optionIndex].votes += 1;
	poll.totalVotes += 1;
	poll.voters.push(userId);
	await poll.save();
	return poll;
};

export const hasUserVoted = async (pollId, userId) => {
	const poll = await Poll.findById(pollId).select("voters").lean();
	if (!poll) return false;
	return poll.voters.some((id) => id.toString() === userId.toString());
};

export const createPoll = async (pollData) => Poll.create(pollData);

export const updatePoll = async (pollId, updateData) =>
	Poll.findByIdAndUpdate(pollId, updateData, { new: true, runValidators: true });

export const deletePoll = async (pollId) => Poll.findByIdAndDelete(pollId);

export const getPollResults = async (pollId) => {
	const poll = await Poll.findById(pollId).lean();
	if (!poll) throw new Error("Poll not found");
	return {
		question: poll.question,
		totalVotes: poll.totalVotes,
		results: poll.options.map((o) => ({
			text: o.text,
			votes: o.votes,
			percentage: poll.totalVotes > 0 ? ((o.votes / poll.totalVotes) * 100).toFixed(1) : 0,
		})),
	};
};
