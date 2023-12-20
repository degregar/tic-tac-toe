import { Server, ServerOptions } from "Socket.IO";
import { NextApiRequest, NextApiResponse } from "next";
import { SocketEvents } from "@/lib/socket/types";
import { GameEventPayload, GameEvents } from "@/lib/game/events";
import { createNewGame } from "@/lib/game/create-new-game";

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
        createNewGame(socket, data);
      } else {
        console.warn("unknown event", data);
      }
    });
  });

  res.socket.server.io = io;
  res.end();
};

export default SocketHandler;
