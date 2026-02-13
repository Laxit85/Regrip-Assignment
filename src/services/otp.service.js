import crypto from 'crypto';
import nodemailer from 'nodemailer';
import redis from '../config/redis.js';
import logger from '../config/logger.js';

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true only if port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Fix self-signed certificate issue (DEV only)
  }
});

// Generate and send OTP
export const generateOTP = async (email) => {
  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const key = `otp:${email}`;

    // Store OTP in Redis (5 minutes expiry)
    await redis.setex(key, 300, otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Task Management App',
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    logger.info(`OTP sent successfully to ${email}`);

    return otp; // for testing (remove in production if needed)
  } catch (error) {
    logger.error(`Send OTP error: ${error.message}`);
    throw new Error('Failed to send OTP');
  }
};

// Verify OTP
export const verifyOTPFromRedis = async (email, otp) => {
  try {
    const key = `otp:${email}`;
    const storedOtp = await redis.get(key);

    if (!storedOtp || storedOtp !== otp) {
      logger.warn(`Invalid OTP attempt for ${email}`);
      return false;
    }

    // Delete OTP after verification
    await redis.del(key);

    logger.info(`OTP verified successfully for ${email}`);
    return true;
  } catch (error) {
    logger.error(`OTP verification error: ${error.message}`);
    return false;
  }
};
