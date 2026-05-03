import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST || process.env.EMAIL_HOST,
		port: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587"),
		secure: false,
		auth: {
			user: process.env.SMTP_USER || process.env.EMAIL_USER,
			pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
		},
	});

	await transporter.sendMail({
		from: `${process.env.FROM_NAME || "propnews24"} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
		to: options.email,
		subject: options.subject,
		text: options.message,
		html: options.html,
	});
};
