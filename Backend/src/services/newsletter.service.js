import nodemailer from "nodemailer";
import Newsletter from "../models/Newsletter.model.js";
import User from "../models/User.model.js";
import { fetchTopHeadlines } from "./newsApi.service.js";
import env from "../config/env.js";

let transporter = null;

const initializeTransporter = () => {
	const user = env.EMAIL_USER || process.env.EMAIL_USER;
	const pass = env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD;
	if (user && pass) {
		try {
			transporter = nodemailer.createTransport({
				host: env.EMAIL_HOST || process.env.EMAIL_HOST || "smtp.gmail.com",
				port: parseInt(env.EMAIL_PORT || process.env.EMAIL_PORT || "587"),
				secure: false,
				auth: { user, pass },
			});
			return true;
		} catch {
			return false;
		}
	}
	return false;
};

export const isEmailAvailable = () => {
	if (!transporter) initializeTransporter();
	return !!transporter;
};

export const subscribeToNewsletter = async (email, userId = null, frequency = "daily") => {
	let newsletter = await Newsletter.findOne({ email });

	if (newsletter) {
		if (newsletter.status === "unsubscribed") {
			newsletter.status = "active";
			newsletter.frequency = frequency;
			newsletter.user = userId;
			await newsletter.save();
			return { success: true, message: "Successfully resubscribed to newsletter" };
		}
		return { success: false, message: "Email already subscribed" };
	}

	newsletter = await Newsletter.create({ email, user: userId, frequency, status: "active" });

	if (userId) {
		await User.findByIdAndUpdate(userId, {
			newsletterSubscribed: true,
			newsletterFrequency: frequency,
		});
	}

	if (isEmailAvailable()) {
		await sendWelcomeEmail(email, newsletter.unsubscribeToken).catch(() => {});
	}

	return { success: true, message: "Successfully subscribed to newsletter" };
};

export const unsubscribeFromNewsletter = async (token) => {
	const newsletter = await Newsletter.findOne({ unsubscribeToken: token });
	if (!newsletter) throw new Error("Invalid unsubscribe token");

	newsletter.status = "unsubscribed";
	await newsletter.save();

	if (newsletter.user) {
		await User.findByIdAndUpdate(newsletter.user, {
			newsletterSubscribed: false,
			newsletterFrequency: "none",
		});
	}

	return { success: true, message: "Successfully unsubscribed from newsletter" };
};

export const getNewsletterSubscribers = async (frequency = "daily") => {
	return Newsletter.find({ status: "active", frequency }).populate("user", "username email");
};

const sendWelcomeEmail = async (email, unsubscribeToken) => {
	if (!isEmailAvailable()) return;

	const unsubscribeUrl = `${env.CLIENT_URL}/newsletter/unsubscribe/${unsubscribeToken}`;

	await transporter.sendMail({
		from: `"propnews24" <${env.EMAIL_USER}>`,
		to: email,
		subject: "Welcome to propnews24 Newsletter! 🇮🇳",
		html: `
			<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
				<div style="background:linear-gradient(135deg,#dc2626,#991b1b);color:white;padding:30px;text-align:center;border-radius:10px 10px 0 0;">
					<h1>🇮🇳 Welcome to propnews24!</h1>
				</div>
				<div style="background:#f9fafb;padding:30px;border-radius:0 0 10px 10px;">
					<h2>Thank you for subscribing!</h2>
					<p>You'll receive the latest India news headlines every morning at 8:00 AM.</p>
					<ul>
						<li>📰 Top India news stories</li>
						<li>🔥 Breaking news updates</li>
						<li>📊 Curated content across 10 categories</li>
					</ul>
					<p style="text-align:center;margin-top:20px;font-size:12px;color:#6b7280;">
						<a href="${unsubscribeUrl}" style="color:#dc2626;">Unsubscribe</a>
					</p>
				</div>
			</div>
		`,
	});
};

export const sendNewsletter = async (frequency = "daily") => {
	if (!isEmailAvailable()) return { success: false, message: "Email not configured" };

	const subscribers = await getNewsletterSubscribers(frequency);
	if (!subscribers.length) return { success: true, sent: 0, message: "No subscribers" };

	const newsData = await fetchTopHeadlines({ country: "in", pageSize: 10 });
	const articles = newsData.articles.filter((a) => a.urlToImage);
	if (!articles.length) return { success: false, message: "No articles available" };

	let sentCount = 0;
	for (const subscriber of subscribers) {
		try {
			await sendNewsletterEmail(subscriber.email, articles, subscriber.unsubscribeToken);
			subscriber.lastSentDate = new Date();
			await subscriber.save();
			sentCount++;
		} catch {
			// skip failed sends, continue with others
		}
	}

	return { success: true, sent: sentCount, total: subscribers.length };
};

const sendNewsletterEmail = async (email, articles, unsubscribeToken) => {
	const unsubscribeUrl = `${env.CLIENT_URL}/newsletter/unsubscribe/${unsubscribeToken}`;
	const date = new Date().toLocaleDateString("en-IN", {
		weekday: "long", year: "numeric", month: "long", day: "numeric",
	});

	const articlesHtml = articles.slice(0, 5).map((a) => `
		<div style="margin-bottom:25px;padding-bottom:25px;border-bottom:1px solid #e5e7eb;">
			${a.urlToImage ? `<img src="${a.urlToImage}" alt="" style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;" />` : ""}
			<h3 style="margin:0 0 8px;color:#111827;">
				<a href="${a.url}" style="color:#111827;text-decoration:none;">${a.title}</a>
			</h3>
			<p style="color:#6b7280;margin:0 0 8px;font-size:14px;">${a.description || ""}</p>
			<div style="font-size:12px;color:#9ca3af;">${a.source?.name || ""} · ${new Date(a.publishedAt).toLocaleDateString("en-IN")}</div>
			<a href="${a.url}" style="display:inline-block;margin-top:8px;color:#dc2626;font-weight:600;text-decoration:none;">Read more →</a>
		</div>
	`).join("");

	await transporter.sendMail({
		from: `"propnews24" <${env.EMAIL_USER}>`,
		to: email,
		subject: `🇮🇳 Your Morning Headlines - ${date}`,
		html: `
			<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
				<div style="background:linear-gradient(135deg,#dc2626,#991b1b);color:white;padding:30px;text-align:center;">
					<h1 style="margin:0;">🇮🇳 propnews24</h1>
					<p style="margin:8px 0 0;opacity:.9;">Your Morning Headlines · ${date}</p>
				</div>
				<div style="background:#fff;padding:30px;">
					<h2 style="color:#111827;margin-top:0;">Top Stories Today</h2>
					${articlesHtml}
					<div style="text-align:center;margin-top:20px;">
						<a href="${env.CLIENT_URL}" style="display:inline-block;padding:12px 30px;background:#dc2626;color:white;text-decoration:none;border-radius:5px;font-weight:600;">
							Read More on propnews24
						</a>
					</div>
				</div>
				<div style="background:#f9fafb;padding:20px;text-align:center;color:#6b7280;font-size:12px;">
					<p>You're receiving this because you subscribed to propnews24 newsletter.</p>
					<p><a href="${unsubscribeUrl}" style="color:#dc2626;">Unsubscribe</a> · <a href="${env.CLIENT_URL}" style="color:#dc2626;">Visit Website</a></p>
					<p>© ${new Date().getFullYear()} propnews24. All rights reserved.</p>
				</div>
			</div>
		`,
	});
};

initializeTransporter();
