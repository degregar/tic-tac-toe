import { useState } from "react";
import { io, Socket } from "socket.io-client";
import { securedAxios } from "@/lib/auth/axios";
import { GameDto } from "@/lib/game/types";
import { SocketEvents } from "@/lib/socket/types";
import {
  BasicUserEventPayload,
  GameEventPayload,
  GameEvents,
} from "@/lib/game/events";
import { PublicUser } from "@/lib/user/types";

export const useSocket = (userData: PublicUser | null) => {
  const [connection, setConnection] = useState<Socket | null>(null);
  const [currentGame, setCurrentGame] = useState<GameDto | null>(null);

  const connect = async () => {
    try {
      await securedAxios.get("/api/game/socket");
      const socket = io();

      socket.on(SocketEvents.CONNECT, () => {
        setConnection(socket);
      });

      socket.on(GameEvents.NEW_GAME_STARTED, (data: GameDto) => {
        setCurrentGame(data);
      });
    } catch (error) {
      console.error("Failed to connect to socket", error);
      setConnection(null);
    }
  };

  const disconnect = () => {
    connection?.disconnect();
    setConnection(null);
  };

  const emit = (event: Omit<GameEventPayload, keyof BasicUserEventPayload>) => {
    connection?.emit(SocketEvents.GAME_EVENT, { user: userData, ...event });
  };

  return {
    connect,
    disconnect,
    isConnected: !!connection,
    emit,
    currentGame,
  };
};
