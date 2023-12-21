import { Server, ServerOptions, Socket } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { JwtAccessToken, SocketEvents } from "@/lib/socket/types";
import {
  GameEventPayload,
  GameEvents,
  UserGameEventPayload,
} from "@/lib/game/events";
import { gameEventsResolver } from "@/lib/game/server/game-events-resolver";
import {
  authenticateUserFromRequest,
  authenticateUserFromToken,
} from "@/lib/auth/acl";
import { StatusCodes } from "http-status-codes";
import { GameEvent } from "@/lib/game/game-events";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: Partial<ServerOptions> & {
      io?: Server;
    };
  };
};

const onGameEvent =
  (socket: Socket, io: Server) => (event: GameEvent & JwtAccessToken) => {
    const user = authenticateUserFromToken(event.jwtAccessToken);

    if (!user) {
      console.warn("Unauthorized user tried to emit event", event);
      return;
    }

    const data: UserGameEventPayload = {
      ...event,
      user,
    };

    const events = gameEventsResolver(data);
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
