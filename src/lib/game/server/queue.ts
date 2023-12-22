import { PublicUser } from "@/lib/user/types";
import { redisClient } from "@/lib/redis/redis";

/**
 * Queue is a set of user uuids.
 * We use set instead of list to avoid duplicates.
 * We don't worry about the user waiting in the queue too long,
 * because users are matched before they are added to the queue.
 *
 * We could mix set and list to implement unique FIFO queue,
 * but it adds unnecessary complexity.
 */

const QUEUE_KEY = "queue";

export const addToQueue = async (player: PublicUser): Promise<void> => {
  await redisClient.sadd(QUEUE_KEY, player.uuid);
};

export const getQueueLength = async (): Promise<number> => {
  return redisClient.scard(QUEUE_KEY);
};

export const fetchFromQueue = async (): Promise<PublicUser["uuid"] | null> => {
  return redisClient.spop(QUEUE_KEY);
};

export const removeFromQueue = async (player: PublicUser): Promise<void> => {
  await redisClient.srem(QUEUE_KEY, player.uuid);
};

export const removeAllFromQueue = async (): Promise<void> => {
  await redisClient.del(QUEUE_KEY);
};
