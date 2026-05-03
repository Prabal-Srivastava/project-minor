// newsApi.service.js — wraps the NewsData.io REST API
// Docs: https://newsdata.io/documentation
import fetch from "node-fetch";
import env from "../config/env.js";

const BASE_URL = env.NEWS_API_BASE_URL;
const API_KEY  = env.NEWS_API_KEY;

/**
 * Fetch latest headlines from NewsData.io.
 *
 * @param {object} opts
 * @param {string}  [opts.q]         - Free-text search query
 * @param {string}  [opts.category]  - Category: business, entertainment, general, health, science, sports, technology
 * @param {string}  [opts.country]   - 2-letter country code (default: "us")
 * @param {string}  [opts.page]      - nextPage token from previous response (pagination)
 * @returns {Promise<{ status: string, totalResults: number, articles: object[] }>}
 */
export const fetchTopHeadlines = async ({
	q,
	category,
	country = "in",   // default to India
	page,
} = {}) => {
	if (!API_KEY) {
		throw new Error(
			"NEWS_API_KEY is not set. Add it to your .env file. " +
			"Get a free key at https://newsdata.io/register or configure NEWS_API_BASE_URL for a different provider."
		);
	}

	const params = new URLSearchParams();
	params.append("apikey",          API_KEY);
	params.append("language",        "en");
	params.append("removeduplicate", "1");
	params.append("country",         country.toLowerCase());

	if (q)        params.append("q",        q);
	if (category) params.append("category", category.toLowerCase());
	if (page)     params.append("page",     page);

	const url = `${BASE_URL}/latest?${params.toString()}`;

	let response;
	try {
		response = await fetch(url, { timeout: 10_000 });
	} catch (networkErr) {
		throw new Error(`[newsApi] Network error reaching NewsData.io: ${networkErr.message}`);
	}

	if (!response.ok) {
		const body = await response.text().catch(() => "");
		throw new Error(
			`[newsApi] NewsData.io responded with HTTP ${response.status}. Body: ${body.slice(0, 300)}`
		);
	}

	let result;
	try {
		result = await response.json();
	} catch {
		throw new Error("[newsApi] Failed to parse JSON from NewsData.io");
	}

	// NewsData.io error envelope: { status: "error", results: { message, code } }
	if (result.status === "error") {
		const msg = result.results?.message || JSON.stringify(result.results);
		const code = result.results?.code || "UNKNOWN";
		throw new Error(`[newsApi] NewsData.io error [${code}]: ${msg}`);
	}

	if (!Array.isArray(result.results)) {
		return { status: "ok", totalResults: 0, articles: [] };
	}

	// Normalise to the shape the rest of the app expects
	const articles = result.results
		.filter((a) => a.title)
		.map((a) => ({
			title:       a.title        || "",
			description: a.description  || "",
			content:     a.content      || a.description || "",
			url:         a.link         || "",
			urlToImage:  a.image_url    || null,
			publishedAt: a.pubDate      || null,
			source: {
				id:   a.source_id   || null,
				name: a.source_name || "Unknown",
			},
		}));

	return {
		status:       "ok",
		totalResults: result.totalResults || articles.length,
		nextPage:     result.nextPage     || null,
		articles,
	};
};
