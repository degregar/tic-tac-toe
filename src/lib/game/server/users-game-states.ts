import { GameState } from "@/lib/game/game-states";

const usersGameStates = new Map<string, GameState>();

export const storeUserGameState = (userId: string, state: GameState) => {
  usersGameStates.set(userId, state);
};

export const getUserGameState = (userId: string): GameState | undefined => {
  return usersGameStates.get(userId);
};

export const removeUserGameState = (userId: string) => {
  usersGameStates.delete(userId);
};

export const getUsersGameStates = async (): Promise<Map<string, GameState>> => {
  return usersGameStates;
};
