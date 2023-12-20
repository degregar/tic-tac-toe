import { Server, ServerOptions, Socket } from "Socket.IO";
import { NextApiRequest, NextApiResponse } from "next";
import { SocketEvents } from "@/lib/socket/types";
import {
  GameEventPayload,
  GameEvents,
  ReadyToPlayEvent,
} from "@/lib/game/events";
import { v4 as uuidv4 } from "uuid";
import { GameDto } from "@/lib/game/types";
import {
  addToQueue,
  getAnotherUserFromQueue,
  isInQueue,
  removeFromQueue,
} from "@/lib/game/queue";

const handleReadyToPlayEvent = (socket: Socket, data: ReadyToPlayEvent) => {
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

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: Partial<ServerOptions> & {
      io?: Server;
    };
  };
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket?.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);

  io.on(SocketEvents.CONNECTION, (socket) => {
    const clientId = socket.id;

    socket.on(SocketEvents.DISCONNECT, () => {
      console.debug("A client disconnected.");
    });

    socket.on("connect", () => {
      console.debug("A client connected.", clientId);
    });

    socket.on(SocketEvents.GAME_EVENT, (data: GameEventPayload) => {
      if (data.type === GameEvents.READY_TO_PLAY) {
        handleReadyToPlayEvent(socket, data);
      } else {
        console.warn("unknown event", data);
      }
    });
  });

  res.socket.server.io = io;
  res.end();
};

export default SocketHandler;
