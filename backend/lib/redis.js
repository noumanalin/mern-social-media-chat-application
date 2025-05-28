import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);

// Redis is key-balue store
// await redis.set('foo', 'bar')


// For test use this type of command: node ./backend/lib/redis.js, then check on website