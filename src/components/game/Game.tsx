import { useGame } from "@/lib/hooks/useGame";
import React, { useEffect } from "react";
import { Board } from "@/components/game/Board";
import { GameStates } from "@/lib/game/game-states";
import { useAuth } from "@/lib/hooks/useAuth";

export const Game = () => {
  const {
    isConnected,
    fetchStatus,
    currentGameState,
    startNewGame,
    isMyTurn,
    makeMove,
    isGameFinished,
    error,
  } = useGame();
  const { user } = useAuth();

  useEffect(() => {
    if (isConnected) {
      void fetchStatus();
    }
  }, [isConnected]);

  if (error) {
    return <div>{error.error}</div>;
  }

  if (!isConnected) {
    return <div>Connecting to the game server...</div>;
  }

  if (currentGameState === null) {
    return <div>Loading...</div>;
  }

  if (isGameFinished && currentGameState.game) {
    const gameState =
      currentGameState.game.winnerUuid === user?.uuid
        ? "You won! 💪"
        : "You lost 😔";

    return (
      <div className={"flex flex-col gap-4"}>
        <div className={"text-center"}>
          <span className={"text-xs text-gray-800"}>
            {currentGameState.game.winnerUuid ? gameState : "Draw"}
          </span>
        </div>

        <div className={"flex justify-center mt-4"}>
          <Board
            board={currentGameState.game.board}
            onMakeMove={() => {}}
            isMyTurn={false}
          />
        </div>

        <StartNewGameButton startNewGame={startNewGame} />
      </div>
    );
  }

  if (currentGameState?.game) {
    const handleMakeMove = (coords: [number, number]) => {
      if (isMyTurn) {
        void makeMove(coords);
      }
    };

    return (
      <div className={"flex flex-col gap-4"}>
        <div className={"text-center"}>
          <span className={"text-xs text-gray-800"}>
            {isMyTurn ? "Your turn" : "Waiting for the opponent"} (
            {currentGameState.game.turn})
          </span>
        </div>

        <div className={"flex justify-center mt-4"}>
          <Board
            board={currentGameState.game.board}
            onMakeMove={handleMakeMove}
            isMyTurn={isMyTurn}
          />
        </div>

        <div className={"text-center"}>
          <span className={"text-xs text-gray-100"}>
            Game: {currentGameState.game.uuid}
          </span>
        </div>
      </div>
    );
  }

  if (currentGameState?.status === GameStates.USER_IN_LOBBY) {
    return (
      <div>
        <span>Connected to the game server</span>
        <StartNewGameButton startNewGame={startNewGame} />
      </div>
    );
  }

  if (currentGameState?.status === GameStates.WAITING_FOR_PLAYERS) {
    return <div>Waiting for the opponent...</div>;
  }

  return <div>Error occured. Please refresh or try again later.</div>;
};

type StartNewGameButtonProps = {
  startNewGame: () => void;
};
const StartNewGameButton = ({ startNewGame }: StartNewGameButtonProps) => {
  return (
    <div
      className={
        "bg-cyan-700 hover:bg-cyan-800 text-white text-center font-bold py-2 px-4 rounded cursor-pointer mt-4"
      }
      onClick={startNewGame}
    >
      Start a new game
    </div>
  );
};
