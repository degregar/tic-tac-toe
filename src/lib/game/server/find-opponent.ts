import { GameState, GameStates } from "@/lib/game/game-states";
import { getUsersGameStates } from "@/lib/game/server/users-game-states";
import { PublicUser } from "@/lib/user/types";

export const findOpponent = async (
  uuid: string,
): Promise<{ user: PublicUser; state: GameState } | undefined> => {
  for (const [userId, state] of (await getUsersGameStates()).entries()) {
    if (userId !== uuid && state.status === GameStates.WAITING_FOR_PLAYERS) {
      return {
        user: {
          uuid: userId,
        },
        state,
      };
    }
  }
  return undefined;
};
