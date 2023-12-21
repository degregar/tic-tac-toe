import Redis from "ioredis";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || "",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || "",
});
