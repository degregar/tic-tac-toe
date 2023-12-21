import { useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { securedAxios } from "@/lib/auth/axios";
import { GameDto } from "@/lib/game/types";
import { JwtAccessToken, SocketEvents } from "@/lib/socket/types";
import { GameEvent } from "@/lib/game/game-events";

export const useSocket = (
  token: string | null,
  onGameEvent: (event: GameEvent) => void,
) => {
  const [connection, setConnection] = useState<Socket | null>(null);
  const [currentGame, setCurrentGame] = useState<GameDto | null>(null);
  const [gameEvent, setGameEvent] = useState<GameEvent | null>(null);

  const connect = useCallback(async () => {
    if (!token) {
      console.warn("No token provided. Won't connect to socket.");
      return;
    }

    try {
      await securedAxios.get("/api/game/socket");
      const socket = io();

      socket.on(SocketEvents.CONNECT, () => {
        console.debug("Connected to socket.");
        setConnection(socket);
      });
    } catch (error) {
      console.error("Failed to connect to socket", error);

      // @TODO handle error, maybe exponential backoff

      setConnection(null);
    }
  }, []);

  if (connection) {
    connection.on(SocketEvents.GAME_EVENT, (event: GameEvent) => {
      onGameEvent(event);
    });
  }

  const disconnect = () => {
    connection?.disconnect();
    setConnection(null);
  };

  const emit = (event: GameEvent) => {
    if (!token) {
      console.warn("No token provided. Won't emit event.");
      return;
    }

    const richEvent: GameEvent & JwtAccessToken = {
      ...event,
      jwtAccessToken: token,
    };
    connection?.emit(SocketEvents.GAME_EVENT, richEvent);
  };

  return {
    connect,
    disconnect,
    isConnected: !!connection,
    emit,
    currentGame,
  };
};
