import {
  CurrentStatusRequestedEvent,
  GameEvent,
  GameEvents,
} from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { getUserGameState } from "@/lib/game/server/users-game-states";
import { GameStates } from "@/lib/game/game-states";

const getCurrentOrDefaultGameState = (uuid: string) => {
  const gameState = getUserGameState(uuid);

  if (gameState) {
    return gameState;
  }

  return {
    status: GameStates.USER_IN_LOBBY,
  };
};

export const handleCurrentStatusRequested = async (
  data: CurrentStatusRequestedEvent & { user: PublicUser },
): Promise<GameEvent[]> => {
  const gameState = getCurrentOrDefaultGameState(data.user.uuid);

  const event: GameEvent = {
    type: GameEvents.CURRENT_STATUS_UPDATED,
    state: gameState,
    recipient: data.user,
  };

  return [event];
};
