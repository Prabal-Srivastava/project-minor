import { GoogleGenerativeAI } from "@google/generative-ai";
import natural from "natural";
import nlp from "compromise";
import Sentiment from "sentiment";
import env from "../config/env.js";

const sentiment = new Sentiment();
const TfIdf = natural.TfIdf;

// Initialize Gemini AI (only if API key is available)
let genAI = null;
let model = null;

const initializeGemini = () => {
	const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
	if (apiKey && apiKey !== "your_gemini_api_key_here") {
		try {
			genAI = new GoogleGenerativeAI(apiKey);
			model = genAI.getGenerativeModel({ model: "gemini-pro" });
			return true;
		} catch {
			return false;
		}
	}
	return false;
};

// Check if Gemini is available
export const isGeminiAvailable = () => {
	if (!genAI) {
		initializeGemini();
	}
	return !!model;
};

/**
 * Generate smart summary using Gemini AI
 */
export const generateSmartSummary = async (articleText, title = "") => {
	if (!isGeminiAvailable()) {
		throw new Error("Gemini AI is not configured. Please add GEMINI_API_KEY to your .env file.");
	}

	try {
		const prompt = `You are a professional news summarizer. Create a concise, bullet-pointed "Quick Read" summary of the following news article.

Article Title: ${title}

Article Content:
${articleText}

Instructions:
1. Create 3-5 bullet points
2. Each bullet should be one clear, concise sentence
3. Focus on the most important facts and key takeaways
4. Use simple, direct language
5. Start each bullet with a dash (-)
6. Do not add any introduction or conclusion text

Summary:`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const summary = response.text();

		return {
			summary: summary.trim(),
			bulletPoints: summary
				.trim()
				.split("\n")
				.filter((line) => line.trim().startsWith("-"))
				.map((line) => line.trim().substring(1).trim()),
		};
	} catch (error) {
		throw new Error("Failed to generate summary: " + error.message);
	}
};

/**
 * Analyze sentiment of article text
 */
export const analyzeSentiment = (text) => {
	try {
		const result = sentiment.analyze(text);

		// Normalize score to -1 to 1 range
		const normalizedScore = Math.max(-1, Math.min(1, result.score / 10));

		let category = "neutral";
		let vibe = "Balanced";

		if (normalizedScore > 0.3) {
			category = "positive";
			vibe = "Positive";
		} else if (normalizedScore < -0.3) {
			category = "negative";
			vibe = "Critical";
		}

		return {
			score: normalizedScore,
			category,
			vibe,
			comparative: result.comparative,
			positive: result.positive,
			negative: result.negative,
			tokens: result.tokens.length,
		};
	} catch (error) {
		return {
			score: 0, category: "neutral", vibe: "Balanced",
			comparative: 0, positive: [], negative: [], tokens: 0,
		};
	}
};

/**
 * Extract keywords from text using NLP
 */
export const extractKeywords = (text, limit = 10) => {
	try {
		const doc = nlp(text);

		// Extract nouns and proper nouns
		const nouns = doc.nouns().out("array");
		const topics = doc.topics().out("array");

		// Combine and deduplicate
		const keywords = [...new Set([...topics, ...nouns])].slice(0, limit);

		return keywords;
	} catch {
		return [];
	}
};

/**
 * Cluster related articles using TF-IDF
 */
export const clusterArticles = (articles) => {
	try {
		if (!articles || articles.length === 0) {
			return [];
		}

		const tfidf = new TfIdf();

		// Add documents to TF-IDF
		articles.forEach((article) => {
			const text = `${article.title} ${article.description || ""} ${article.content || ""}`;
			tfidf.addDocument(text);
		});

		// Calculate similarity matrix
		const clusters = [];
		const processed = new Set();

		articles.forEach((article, i) => {
			if (processed.has(i)) return;

			const cluster = {
				mainArticle: article,
				relatedArticles: [],
				keywords: extractKeywords(
					`${article.title} ${article.description || ""}`,
					5
				),
			};

			// Find similar articles
			articles.forEach((otherArticle, j) => {
				if (i === j || processed.has(j)) return;

				// Calculate similarity using TF-IDF
				const similarity = calculateSimilarity(tfidf, i, j);

				if (similarity > 0.3) {
					// Threshold for similarity
					cluster.relatedArticles.push(otherArticle);
					processed.add(j);
				}
			});

			processed.add(i);
			clusters.push(cluster);
		});

		return clusters;
	} catch {
		return articles.map((article) => ({
			mainArticle: article,
			relatedArticles: [],
			keywords: [],
		}));
	}
};

/**
 * Calculate similarity between two documents using TF-IDF
 */
const calculateSimilarity = (tfidf, docIndex1, docIndex2) => {
	try {
		const terms1 = {};
		const terms2 = {};

		// Get TF-IDF scores for both documents
		tfidf.listTerms(docIndex1).forEach((item) => {
			terms1[item.term] = item.tfidf;
		});

		tfidf.listTerms(docIndex2).forEach((item) => {
			terms2[item.term] = item.tfidf;
		});

		// Calculate cosine similarity
		const allTerms = new Set([...Object.keys(terms1), ...Object.keys(terms2)]);
		let dotProduct = 0;
		let magnitude1 = 0;
		let magnitude2 = 0;

		allTerms.forEach((term) => {
			const score1 = terms1[term] || 0;
			const score2 = terms2[term] || 0;

			dotProduct += score1 * score2;
			magnitude1 += score1 * score1;
			magnitude2 += score2 * score2;
		});

		if (magnitude1 === 0 || magnitude2 === 0) return 0;

		return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
	} catch (error) {
		return 0;
	}
};

/**
 * Analyze article with all AI features
 */
export const analyzeArticle = async (article, includeGemini = false) => {
	try {
		const text = `${article.title} ${article.description || ""} ${article.content || ""}`;

		// Always available features (no API key needed)
		const sentimentData = analyzeSentiment(text);
		const keywords = extractKeywords(text, 10);

		const analysis = {
			sentiment: sentimentData,
			keywords,
			hasGemini: isGeminiAvailable(),
		};

		// Gemini-powered features (only if API key is configured)
		if (includeGemini && isGeminiAvailable()) {
			try {
				const summaryData = await generateSmartSummary(
					article.content || article.description || "",
					article.title
				);
				analysis.summary = summaryData;
			} catch (error) {
				analysis.summaryError = error.message;
			}
		}

		return analysis;
	} catch (error) {
		throw error;
	}
};

/**
 * Filter articles by sentiment
 */
export const filterBySentiment = (articles, vibeFilter) => {
	try {
		if (!vibeFilter || vibeFilter === "all") {
			return articles;
		}

		return articles.filter((article) => {
			const text = `${article.title} ${article.description || ""}`;
			const sentimentData = analyzeSentiment(text);

			if (vibeFilter === "positive") {
				return sentimentData.category === "positive";
			} else if (vibeFilter === "negative" || vibeFilter === "critical") {
				return sentimentData.category === "negative";
			} else if (vibeFilter === "neutral") {
				return sentimentData.category === "neutral";
			}

			return true;
		});
	} catch {
		return articles;
	}
};

// Initialize on module load
initializeGemini();
