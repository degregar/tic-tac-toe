import {
  GameEvents,
  isCurrentStatusRequestedEvent,
  isReadyToPlayEvent,
  UserGameEventPayload,
} from "@/lib/game/events";
import { handleNewGame } from "@/lib/game/server/handle-new-game";
import { handleCurrentStatusRequested } from "@/lib/game/server/handle-current-status-requested";
import { GameEvent } from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";

export type SocketEvent = {
  type: string;
  socketId: string;
  payload: GameEvent;
};

export const resolveGameEvents = async (
  event: GameEvent & { user: PublicUser },
): Promise<GameEvent[]> => {
  if (isCurrentStatusRequestedEvent(event)) {
    return handleCurrentStatusRequested(event);
  }

  return [];
};
