import { useState } from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "@/lib/hooks/useAuth";
import { GameDto } from "@/lib/game/types";
import { useSocket } from "@/lib/hooks/useSocket";
import { GameEvents } from "@/lib/game/events";

export const useGame = () => {
  const { user } = useAuth();
  const { emit, connect, disconnect, isConnected, currentGame } =
    useSocket(user);

  const findPartner = async () => {
    if (!user) {
      return;
    }

    emit({ type: GameEvents.READY_TO_PLAY });
  };

  return {
    connect,
    disconnect,
    isConnected,
    findPartner,
    currentGame,
  };
};
