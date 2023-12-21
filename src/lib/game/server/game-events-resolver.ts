import { handleCurrentStatusRequested } from "@/lib/game/server/handle-current-status-requested";
import {
  GameEvent,
  isCurrentStatusRequestedEvent,
  isMoveMadeEvent,
  isNewMatchRequestedEvent,
} from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { handleNewMatchRequestedEvent } from "@/lib/game/server/handle-new-match-requested";
import { handleMoveMadeEvent } from "@/lib/game/server/handle-move-made";

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

  if (isMoveMadeEvent(event)) {
    return await handleMoveMadeEvent(event);
  }

  return [];
};
