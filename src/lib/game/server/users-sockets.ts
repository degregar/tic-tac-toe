import { redisClient } from "@/lib/redis/redis";

const getRedisKey = (userId: string) => `users-sockets:${userId}`;

export const storeSocketId = async (userId: string, socketId: string) => {
  await redisClient.set(getRedisKey(userId), socketId);
};

export const getSocketId = async (userId: string): Promise<string | null> => {
  return redisClient.get(getRedisKey(userId));
};

export const removeSocketId = async (userId: string) => {
  await redisClient.del(getRedisKey(userId));
};
