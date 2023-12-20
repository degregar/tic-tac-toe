import { isReadyToPlayEvent, UserGameEventPayload } from "@/lib/game/events";
import { handleNewGame } from "@/lib/game/handle-new-game";

export type SocketEvent = {
  type: string;
  socketId: string;
  data: any;
};

export const gameEventHandler = (
  payload: UserGameEventPayload,
): SocketEvent[] => {
  if (isReadyToPlayEvent(payload)) {
    return handleNewGame(payload);
  }

  console.warn("unknown event", payload);

  return [];
};
