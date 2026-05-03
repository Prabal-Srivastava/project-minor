const isProd = process.env.NODE_ENV === "production";

export const logger = {
	info:  (msg) => { if (!isProd) console.log(`[INFO]  ${new Date().toISOString()}: ${msg}`) },
	error: (msg) => { if (!isProd) console.error(`[ERROR] ${new Date().toISOString()}: ${msg}`) },
	warn:  (msg) => { if (!isProd) console.warn(`[WARN]  ${new Date().toISOString()}: ${msg}`) },
};
