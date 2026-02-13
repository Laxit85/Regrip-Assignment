import Redis from 'ioredis';

// Redis client for OTP storage and rate limiting
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export default redis;
