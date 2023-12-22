import { redisClient } from "@/lib/redis/redis";
import { GameState } from "@/lib/game/game-states";

const getRedisKey = (userId: string) => `users-gamestates:${userId}`;

export const storeUserGameState = async (userId: string, state: GameState) => {
  const serializedState = JSON.stringify(state);
  await redisClient.set(getRedisKey(userId), serializedState);
};

export const getUserGameState = async (
  userId: string,
): Promise<GameState | null> => {
  const serializedState = await redisClient.get(getRedisKey(userId));
  return serializedState ? JSON.parse(serializedState) : null;
};

export const removeUserGameState = async (userId: string) => {
  await redisClient.del(getRedisKey(userId));
};

export const removeAllUserGameStates = async (): Promise<void> => {
  const keys = await redisClient.keys("users-gamestates:*");
  if (keys.length > 0) {
    await redisClient.del(...keys);
  }
};
