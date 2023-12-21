import { CurrentStatusRequestedEvent, GameEvents } from "@/lib/game/events";
import { GameEvent } from "@/lib/game/game-events";
import { GameStates } from "@/lib/game/game-states";

export const handleCurrentStatusRequested = (
  data: CurrentStatusRequestedEvent,
): GameEvent[] => {
  const event: GameEvent = {
    type: GameEvents.CURRENT_STATUS_UPDATED,
    state: {
      status: GameStates.USER_IN_LOBBY,
    },
    recipient: data.user,
  };

  return [event];
};
