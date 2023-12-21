import {
  CurrentStatusRequestedEvent,
  GameEvent,
  GameEvents,
} from "@/lib/game/game-events";
import { GameStates } from "@/lib/game/game-states";
import { PublicUser } from "@/lib/user/types";

export const handleCurrentStatusRequested = async (
  data: CurrentStatusRequestedEvent & { user: PublicUser },
): Promise<GameEvent[]> => {
  const event: GameEvent = {
    type: GameEvents.CURRENT_STATUS_UPDATED,
    state: {
      status: GameStates.USER_IN_LOBBY,
    },
    recipient: data.user,
  };

  return [event];
};
