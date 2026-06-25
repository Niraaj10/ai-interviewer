import rateLimit from "express-rate-limit";

export const tokenEndpointRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many token requests. Please wait a moment and try again"
    }
});