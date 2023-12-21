import {
  GameEvent,
  GameEvents,
  NewMatchRequestedEvent,
} from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { GameStates } from "@/lib/game/game-states";

export const handleNewMatchRequestedEvent = async (
  data: NewMatchRequestedEvent & { user: PublicUser },
): Promise<GameEvent[]> => {
  const event: GameEvent = {
    type: GameEvents.CURRENT_STATUS_UPDATED,
    state: {
      status: GameStates.WAITING_FOR_PLAYERS,
    },
    recipient: data.user,
  };

  return [event];
};
