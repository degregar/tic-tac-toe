import { Server, ServerOptions } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { SocketEvents } from "@/lib/socket/types";
import { GameEventPayload, GameEvents } from "@/lib/game/events";
import { handleNewGame } from "@/lib/game/handle-new-game";
import { gameEventHandler } from "@/lib/game/game-event-handler";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: Partial<ServerOptions> & {
      io?: Server;
    };
  };
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);

  io.on(SocketEvents.CONNECTION, (socket) => {
    const socketId = socket.id;

    socket.on(SocketEvents.DISCONNECT, () => {
      console.debug("A client disconnected.");
    });

    socket.on(SocketEvents.GAME_EVENT, (data: GameEventPayload) => {
      gameEventHandler({ ...data, socketId }).forEach((event) => {
        socket.to(event.socketId).emit(event.type, event.data);
      });
    });
  });

  res.socket.server.io = io;
  res.end();
};

export default SocketHandler;
