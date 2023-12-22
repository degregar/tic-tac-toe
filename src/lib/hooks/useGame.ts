import { useAuth } from "@/lib/hooks/useAuth";
import { useSocket } from "@/lib/hooks/useSocket";
import { useEffect, useState } from "react";
import {
  GameEvent,
  GameEvents,
  isCurrentStatusUpdatedEvent,
} from "@/lib/game/game-events";
import { GameState, GameStates } from "@/lib/game/game-states";
import {
  GameError,
  GameErrors,
  SocketError,
  SocketErrors,
} from "@/lib/errors/types";

export const useGame = () => {
  const { user, token } = useAuth();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<GameError | null>(null);

  const handleGameEvent = (event: GameEvent) => {
    if (isCurrentStatusUpdatedEvent(event)) {
      setGameState(event.state);
    }
  };

  const handleConnectionError = (error: SocketError) => {
    if (error.error_code === SocketErrors.NO_CONNECTION) {
      setError({
        error:
          "Failed to connect to the game server. Please try again later or check your internet connection.",
        error_code: GameErrors.NO_CONNECTION,
      });
    } else {
      setError({
        error: "Unknown error",
        error_code: GameErrors.UNKNOWN,
      });
    }

    setGameState(null);
  };

  const { emit, connect, disconnect, isConnected } = useSocket(
    token,
    handleGameEvent,
    handleConnectionError,
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
      setError({
        error: "You need to be logged in to start a new game.",
        error_code: GameErrors.NOT_AUTHENTICATED,
      });
      return;
    }

    emit({ type: GameEvents.NEW_MATCH_REQUESTED });
  };

  const makeMove = async (move: [number, number]) => {
    if (!user) {
      setError({
        error: "You need to be logged in to start a new game",
        error_code: GameErrors.NOT_AUTHENTICATED,
      });
      return;
    }

    if (!gameState?.game?.uuid) {
      setError({
        error: "No game in progress",
        error_code: GameErrors.UNKNOWN,
      });
      return;
    }

    emit({ type: GameEvents.MOVE_MADE, move, gameId: gameState?.game?.uuid });
  };

  const isMyTurn =
    (gameState?.game?.turn === "X" &&
      gameState?.game?.playerXUuid === user?.uuid) ||
    (gameState?.game?.turn === "O" &&
      gameState?.game?.playerOUuid === user?.uuid);

  const isGameFinished = gameState?.status === GameStates.FINISHED;

  return {
    isConnected,
    fetchStatus,
    startNewGame,
    currentGameState: gameState,
    isMyTurn,
    makeMove,
    isGameFinished,
    error,
  };
};
