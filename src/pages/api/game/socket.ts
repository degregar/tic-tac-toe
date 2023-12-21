import { Server, ServerOptions, Socket } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { JwtAccessToken, SocketEvents } from "@/lib/socket/types";
import { resolveGameEvents } from "@/lib/game/server/game-events-resolver";
import {
  authenticateUserFromRequest,
  authenticateUserFromToken,
} from "@/lib/auth/acl";
import { StatusCodes } from "http-status-codes";
import { GameEvent } from "@/lib/game/game-events";
import { resolveSocketEvents } from "@/lib/game/server/socket-events-resolver";
import { PublicUser } from "@/lib/user/types";
import { storeSocketId } from "@/lib/game/server/users-sockets";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: Partial<ServerOptions> & {
      io?: Server;
    };
  };
};

const onGameEvent =
  (socket: Socket, io: Server) => async (event: GameEvent & JwtAccessToken) => {
    console.log("Received event", event);
    const user = authenticateUserFromToken(event.jwtAccessToken);

    if (!user) {
      console.warn("Unauthorized user tried to emit event", event);
      return;
    }

    storeSocketId(user.uuid, socket.id);

    const gameWithUserEvent: GameEvent & { user: PublicUser } = {
      ...event,
      user,
    };

    try {
      const gameEvents: GameEvent[] =
        await resolveGameEvents(gameWithUserEvent);

      const events = await resolveSocketEvents(gameEvents);
      events.forEach((event) => {
        io.to(event.socketId).emit(event.type, event.payload);
      });
    } catch (error) {
      // @TODO: handle error, maybe send something back to the client
      console.error(error);
    }
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
