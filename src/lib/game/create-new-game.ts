import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { GameEvents, ReadyToPlayEvent } from "@/lib/game/events";
import {
  addToQueue,
  getAnotherUserFromQueue,
  isInQueue,
  removeFromQueue,
} from "@/lib/game/queue";
import { GameDto } from "@/lib/game/types";

export const createNewGame = (socket: Socket, data: ReadyToPlayEvent) => {
  if (!isInQueue(data.user)) {
    addToQueue(data.user, socket.id);
  }

  const anotherUser = getAnotherUserFromQueue(data.user);
  if (!anotherUser) {
    return;
  }

  removeFromQueue(data.user);
  removeFromQueue(anotherUser);

  const game: GameDto = {
    uuid: uuidv4(),
    playerXUuid: data.user.uuid,
    playerOUuid: anotherUser.uuid,
    winnerUuid: null,
  };

  socket.emit(GameEvents.NEW_GAME_STARTED, game);
  socket.to(anotherUser._socketId).emit(GameEvents.NEW_GAME_STARTED, game);
};
