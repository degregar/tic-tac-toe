import { handleCurrentStatusRequested } from "@/lib/game/server/handle-current-status-requested";
import {
  GameEvent,
  isCurrentStatusRequestedEvent,
  isNewMatchRequestedEvent,
} from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { handleNewMatchRequestedEvent } from "@/lib/game/server/handle-new-match-requested";

export type SocketEvent = {
  type: string;
  socketId: string;
  payload: GameEvent;
};

export const resolveGameEvents = async (
  event: GameEvent & { user: PublicUser },
): Promise<GameEvent[]> => {
  if (isCurrentStatusRequestedEvent(event)) {
    return await handleCurrentStatusRequested(event);
  }
  if (isNewMatchRequestedEvent(event)) {
    return await handleNewMatchRequestedEvent(event);
  }

  return [];
};
