import { GameEventPayload, GameEvents } from "@/lib/game/events";
import { handleNewGame } from "@/lib/game/handle-new-game";

export type SocketEvent = {
  type: string;
  socketId: string;
  data: any;
};

export const gameEventHandler = (
  payload: GameEventPayload & { socketId: string },
): SocketEvent[] => {
  if (payload.type === GameEvents.READY_TO_PLAY) {
    return handleNewGame(payload);
  } else {
    console.warn("unknown event", payload);
  }

  return [];
};
