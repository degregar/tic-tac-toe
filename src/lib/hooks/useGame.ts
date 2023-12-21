import { useAuth } from "@/lib/hooks/useAuth";
import { useSocket } from "@/lib/hooks/useSocket";
import { GameEvents } from "@/lib/game/events";
import { useEffect } from "react";
import { GameEvent } from "@/lib/game/game-events";

export const useGame = () => {
  const { user, token } = useAuth();

  const handleGameEvent = (event: GameEvent) => {
    console.log("new game event", event);
  };

  const { emit, connect, disconnect, isConnected } = useSocket(
    token,
    handleGameEvent,
  );

  useEffect(() => {
    void connect();

    return () => {
      disconnect();
    };
  }, []);

  const fetchStatus = async () => {
    console.debug("Fetching game status...");
    emit({ type: GameEvents.CURRENT_STATUS_REQUESTED });
  };

  const startNewGame = async () => {
    if (!user) {
      return;
    }

    // @TODO Emit event to start new game
  };

  return {
    isConnected,
    fetchStatus,
    startNewGame,
    currentGame: null,
  };
};
