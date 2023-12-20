import { useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { securedAxios } from "@/lib/auth/axios";
import { GameDto } from "@/lib/game/types";
import { SocketEvents } from "@/lib/socket/types";
import {
  JwtAccessToken,
  GameEventPayload,
  GameEvents,
} from "@/lib/game/events";

export const useSocket = (token: string | null) => {
  const [connection, setConnection] = useState<Socket | null>(null);
  const [currentGame, setCurrentGame] = useState<GameDto | null>(null);

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
    connection.on(GameEvents.NEW_GAME_STARTED, (data: GameDto) => {
      console.debug("New game started", data);
      setCurrentGame(data);
    });
  }

  const disconnect = () => {
    connection?.disconnect();
    setConnection(null);
  };

  const emit = (event: Omit<GameEventPayload, keyof JwtAccessToken>) => {
    connection?.emit(SocketEvents.GAME_EVENT, {
      jwtAccessToken: token,
      ...event,
    });
  };

  return {
    connect,
    disconnect,
    isConnected: !!connection,
    emit,
    currentGame,
  };
};
