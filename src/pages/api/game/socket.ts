import { Server, ServerOptions, Socket } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { SocketEvents } from "@/lib/socket/types";
import { GameEventPayload, UserGameEventPayload } from "@/lib/game/events";
import { gameEventHandler } from "@/lib/game/game-event-handler";
import {
  authenticateUserFromRequest,
  authenticateUserFromToken,
} from "@/lib/auth/acl";
import { StatusCodes } from "http-status-codes";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: Partial<ServerOptions> & {
      io?: Server;
    };
  };
};

const onGameEvent =
  (socket: Socket, io: Server) => (payload: GameEventPayload) => {
    const user = authenticateUserFromToken(payload.jwtAccessToken);

    if (!user) {
      console.warn("Unauthorized user tried to emit event", payload);
      return;
    }

    const data: UserGameEventPayload = {
      ...payload,
      user,
      socketId: socket.id,
    };

    const events = gameEventHandler(data);
    events.forEach((event) => {
      io.to(event.socketId).emit(event.type, event.data);
    });
  };

const onConnectionEvent = (io: Server) => (socket: Socket) => {
  socket.on(SocketEvents.DISCONNECT, () => {
    console.debug("A client disconnected.");
  });

  socket.on(SocketEvents.GAME_EVENT, onGameEvent(socket, io));
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  const user = authenticateUserFromRequest(req);
  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).end();
    return;
  }

  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);

  io.on(SocketEvents.CONNECTION, onConnectionEvent(io));

  res.socket.server.io = io;
  res.end();
};

export default SocketHandler;
