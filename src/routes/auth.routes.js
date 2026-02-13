import express from 'express';
import { sendOTP, verifyOTP, refreshToken, logout } from '../controllers/auth.controller.js';
import { authLimiter, apiLimiter } from '../middleware/rateLimit.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { sendOtpSchema, verifyOtpSchema, refreshTokenSchema } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/auth/send-otp
router.post('/send-otp', authLimiter, validate(sendOtpSchema), sendOTP);

// POST /api/auth/verify-otp
router.post('/verify-otp', validate(verifyOtpSchema), verifyOTP);

// POST /api/auth/refresh-token
router.post('/refresh-token', apiLimiter, validate(refreshTokenSchema), refreshToken);

// POST /api/auth/logout
router.post('/logout', authenticate, logout);

export default router;
