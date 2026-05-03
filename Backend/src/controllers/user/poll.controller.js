import { asyncHandler } from "../../utils/asyncHandler.util.js";
import {
	getPollOfTheDay,
	getActivePolls,
	voteOnPoll,
	hasUserVoted,
	getPollResults,
} from "../../services/poll.service.js";

/**
 * @desc    Get poll of the day
 * @route   GET /api/v1/user/polls/today
 * @access  Public
 */
export const getTodayPoll = asyncHandler(async (req, res) => {
	const poll = await getPollOfTheDay();

	if (!poll) {
		return res.status(404).json({
			success: false,
			message: "No active poll found for today",
		});
	}

	// Check if user has voted (if authenticated)
	let hasVoted = false;
	if (req.user) {
		hasVoted = await hasUserVoted(poll._id, req.user._id);
	}

	res.status(200).json({
		success: true,
		data: {
			...poll,
			hasVoted,
		},
	});
});

/**
 * @desc    Get all active polls
 * @route   GET /api/v1/user/polls
 * @access  Public
 */
export const getPolls = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10, category } = req.query;

	const result = await getActivePolls({
		page: parseInt(page),
		limit: parseInt(limit),
		category,
	});

	res.status(200).json({
		success: true,
		data: result.polls,
		pagination: result.pagination,
	});
});

/**
 * @desc    Vote on a poll
 * @route   POST /api/v1/user/polls/:pollId/vote
 * @access  Private
 */
export const vote = asyncHandler(async (req, res) => {
	const { pollId } = req.params;
	const { optionIndex } = req.body;
	const userId = req.user._id;

	if (optionIndex === undefined || optionIndex === null) {
		return res.status(400).json({
			success: false,
			message: "Option index is required",
		});
	}

	const poll = await voteOnPoll(pollId, userId, parseInt(optionIndex));

	res.status(200).json({
		success: true,
		message: "Vote recorded successfully",
		data: poll,
	});
});

/**
 * @desc    Get poll results
 * @route   GET /api/v1/user/polls/:pollId/results
 * @access  Public
 */
export const getResults = asyncHandler(async (req, res) => {
	const { pollId } = req.params;

	const results = await getPollResults(pollId);

	res.status(200).json({
		success: true,
		data: results,
	});
});
