import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../config/db.js';
import logger from '../config/logger.js';

// Generate access and refresh tokens
export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

// Hash refresh token before storing
export const hashRefreshToken = async (token) => {
  return await bcrypt.hash(token, 10);
};

// Verify refresh token and rotate
export const verifyAndRotateRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, refreshToken: true }
    });

    if (!user || !user.refreshToken) {
      throw new Error('Invalid refresh token');
    }

    // Check if hashed token matches
    const isValid = await bcrypt.compare(token, user.refreshToken);
    if (!isValid) {
      throw new Error('Invalid refresh token');
    }

    // Generate new tokens (rotation)
    const newTokens = generateTokens(user.id);
    const hashedNewRefresh = await hashRefreshToken(newTokens.refreshToken);

    // Update DB with new hashed refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedNewRefresh }
    });

    logger.info(`Refresh token rotated for user ${user.id}`);
    return newTokens;
  } catch (error) {
    logger.error(`Refresh token verification failed: ${error.message}`);
    throw error;
  }
};

// Verify access token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid access token');
  }
};
