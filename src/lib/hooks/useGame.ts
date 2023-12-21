import { useAuth } from "@/lib/hooks/useAuth";
import { useSocket } from "@/lib/hooks/useSocket";
import { useEffect, useState } from "react";
import {
  GameEvent,
  GameEvents,
  isCurrentStatusUpdatedEvent,
} from "@/lib/game/game-events";
import { GameState } from "@/lib/game/game-states";

export const useGame = () => {
  const { user, token } = useAuth();
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleGameEvent = (event: GameEvent) => {
    if (isCurrentStatusUpdatedEvent(event)) {
      setGameState(event.state);
    }
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
    emit({ type: GameEvents.CURRENT_STATUS_REQUESTED });
  };

  const startNewGame = async () => {
    if (!user) {
      return;
    }

    emit({ type: GameEvents.NEW_MATCH_REQUESTED });
  };

  const makeMove = async (move: [number, number]) => {
    if (!user || !gameState?.game?.uuid) {
      return;
    }

    emit({ type: GameEvents.MOVE_MADE, move, gameId: gameState?.game?.uuid });
  };

  const isMyTurn =
    (gameState?.game?.turn === "X" &&
      gameState?.game?.playerXUuid === user?.uuid) ||
    (gameState?.game?.turn === "O" &&
      gameState?.game?.playerOUuid === user?.uuid);

  return {
    isConnected,
    fetchStatus,
    startNewGame,
    currentGameState: gameState,
    isMyTurn,
    makeMove,
  };
};
