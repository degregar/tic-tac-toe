import { GameState } from "@/lib/game/game-states";

const usersGameStates = new Map<string, GameState>();

export const storeUserGameState = async (userId: string, state: GameState) => {
  usersGameStates.set(userId, state);
};

export const getUserGameState = async (
  userId: string,
): Promise<GameState | undefined> => {
  return usersGameStates.get(userId);
};

export const removeUserGameState = async (userId: string) => {
  usersGameStates.delete(userId);
};

export const getUsersGameStates = async (): Promise<Map<string, GameState>> => {
  return usersGameStates;
};
