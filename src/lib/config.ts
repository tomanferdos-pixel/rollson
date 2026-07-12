export const APP_NAME = "Rollson";
export const APP_VERSION = process.env.APP_VERSION || "Rollson-v1.0.0";
export const MAIL_WINDOW_MINUTES = Number(process.env.MAIL_WINDOW_MINUTES || "10") || 10;
export const RATE_LIMIT_PER_MINUTE = Number(process.env.RATE_LIMIT_PER_MINUTE || "30") || 30;
