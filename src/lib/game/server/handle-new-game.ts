import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import {
  GameEvents,
  MatchReadinessConfirmedEvent,
  UserEventPayload,
} from "@/lib/game/events";
import {
  addToQueue,
  getAnotherUserFromQueue,
  isInQueue,
  removeFromQueue,
} from "@/lib/game/queue";
import { GameDto } from "@/lib/game/types";
import { SocketEvent } from "@/lib/game/server/game-events-resolver";

export const handleNewGame = (
  data: MatchReadinessConfirmedEvent & UserEventPayload,
): SocketEvent[] => {
  if (!isInQueue(data.user)) {
    addToQueue(data.user, data.socketId);
  }

  const anotherUser = getAnotherUserFromQueue(data.user);
  if (!anotherUser) {
    return [];
  }

  removeFromQueue(data.user);
  removeFromQueue(anotherUser);

  const game: GameDto = {
    uuid: uuidv4(),
    playerXUuid: data.user.uuid,
    playerOUuid: anotherUser.uuid,
    winnerUuid: null,
  };

  const event = {
    type: GameEvents.NEW_GAME_STARTED,
    data: game,
  };

  return [
    {
      ...event,
      socketId: data.socketId,
    },
    {
      ...event,
      socketId: anotherUser._socketId,
    },
  ];
};