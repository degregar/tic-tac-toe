import { useAuth } from "@/lib/hooks/useAuth";
import { useSocket } from "@/lib/hooks/useSocket";
import { GameEvents } from "@/lib/game/events";
import { useEffect } from "react";

export const useGame = () => {
  const { user, token } = useAuth();
  const { emit, connect, disconnect, isConnected, currentGame } =
    useSocket(token);

  useEffect(() => {
    void connect();

    return () => {
      disconnect();
    };
  }, []);

  const startNewGame = async () => {
    if (!user) {
      return;
    }

    emit({ type: GameEvents.READY_TO_PLAY });
  };

  return {
    isConnected,
    startNewGame,
    currentGame,
  };
};
