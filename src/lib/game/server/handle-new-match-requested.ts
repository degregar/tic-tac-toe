import {
  GameEvent,
  GameEvents,
  NewMatchRequestedEvent,
} from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { GameStates } from "@/lib/game/game-states";
import { storeUserGameState } from "@/lib/game/server/users-game-states";

export const handleNewMatchRequestedEvent = async (
  data: NewMatchRequestedEvent & { user: PublicUser },
): Promise<GameEvent[]> => {
  storeUserGameState(data.user.uuid, {
    status: GameStates.WAITING_FOR_PLAYERS,
    game: null,
  });

  const event: GameEvent = {
    type: GameEvents.CURRENT_STATUS_UPDATED,
    state: {
      status: GameStates.WAITING_FOR_PLAYERS,
      game: null,
    },
    recipient: data.user,
  };

  return [event];
};
