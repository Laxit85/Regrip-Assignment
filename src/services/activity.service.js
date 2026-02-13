import prisma from '../config/db.js';
import logger from '../config/logger.js';

// Log activity to database
export const logActivity = async (type, message, userId = null) => {
  try {
    await prisma.activity.create({
      data: { type, message, userId }
    });
    logger.info(`Activity logged: ${type} - ${message} for user ${userId || 'anonymous'}`);
  } catch (error) {
    logger.error(`Failed to log activity: ${error.message}`);
  }
};
