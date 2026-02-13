import prisma from '../config/db.js';
import { generateOTP, verifyOTPFromRedis } from '../services/otp.service.js';
import { generateTokens, hashRefreshToken, verifyAndRotateRefreshToken } from '../services/token.service.js';
import { logActivity } from '../services/activity.service.js';
import logger from '../config/logger.js';

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists or create new one (not verified yet)
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }

    await generateOTP(email);
    await logActivity('otp_sent', `OTP sent to ${email}`, user.id);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    logger.error(`Send OTP error: ${error.message}`);
    throw error;
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const isValid = await verifyOTPFromRedis(email, otp);
    if (!isValid) {
      await logActivity('otp_failed', `Invalid OTP for ${email}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, isVerified: true } });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true }
      });
    }

    const tokens = generateTokens(user.id);
    const hashedRefresh = await hashRefreshToken(tokens.refreshToken);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh }
    });

    await logActivity('login_success', `User ${email} logged in successfully`, user.id);

    res.json(tokens);
  } catch (error) {
    logger.error(`Verify OTP error: ${error.message}`);
    throw error;
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const newTokens = await verifyAndRotateRefreshToken(refreshToken);
    await logActivity('token_refresh', 'Access token refreshed');

    res.json(newTokens);
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Clear refresh token from DB
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });

    await logActivity('logout', 'User logged out', userId);

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    throw error;
  }
};
