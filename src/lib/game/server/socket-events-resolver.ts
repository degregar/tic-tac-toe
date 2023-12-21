import { GameEvent, isWithRecipient } from "@/lib/game/game-events";
import { SocketEvent } from "@/lib/game/server/game-events-resolver";
import { SocketEvents } from "@/lib/socket/types";
import { resolveSocketId } from "@/lib/game/server/socket-id-resolver";

export const resolveSocketEvents = async (
  gameEvents: GameEvent[],
): Promise<SocketEvent[]> => {
  const socketEvents: (SocketEvent | null)[] = await Promise.all(
    gameEvents.map(async (gameEvent) => {
      if (isWithRecipient(gameEvent)) {
        try {
          const socketId = await resolveSocketId(gameEvent.recipient);

          const socketEvent: SocketEvent = {
            type: SocketEvents.GAME_EVENT,
            payload: gameEvent,
            socketId,
          };

          return socketEvent;
        } catch (error) {
          throw new Error("User is not connected");
        }
      } else {
        return null;
      }
    }),
  );

  return socketEvents.filter(
    (socketEvent) => socketEvent !== null,
  ) as SocketEvent[];
};
