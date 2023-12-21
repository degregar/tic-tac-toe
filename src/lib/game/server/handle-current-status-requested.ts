import {
  CurrentStatusRequestedEvent,
  GameEvent,
  GameEvents,
} from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { getUserGameState } from "@/lib/game/server/users-game-states";
import { GameState, GameStates } from "@/lib/game/game-states";

const getCurrentOrDefaultGameState = async (uuid: string) => {
  const gameState = await getUserGameState(uuid);

  if (gameState) {
    return gameState;
  }

  const userInLobby: GameState = {
    status: GameStates.USER_IN_LOBBY,
    game: null,
  };

  return userInLobby;
};

export const handleCurrentStatusRequested = async (
  data: CurrentStatusRequestedEvent & { user: PublicUser },
): Promise<GameEvent[]> => {
  const gameState = await getCurrentOrDefaultGameState(data.user.uuid);

  const event: GameEvent = {
    type: GameEvents.CURRENT_STATUS_UPDATED,
    state: gameState,
    recipient: data.user,
  };

  return [event];
};
