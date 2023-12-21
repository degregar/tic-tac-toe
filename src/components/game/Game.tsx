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
  } = useGame();
  const { user } = useAuth();

  useEffect(() => {
    if (isConnected) {
      void fetchStatus();
    }
  }, [isConnected]);

  if (!isConnected) {
    return <div>Łączenie z serwerem...</div>;
  }

  if (currentGameState === null) {
    return <div>Ładowanie...</div>;
  }

  if (isGameFinished && currentGameState.game) {
    const gameState =
      currentGameState.game.winnerUuid === user?.uuid
        ? "Wygrałeś! 💪"
        : "Przegrałeś 😔";

    return (
      <div className={"flex flex-col gap-4"}>
        <div className={"text-center"}>
          <span className={"text-xs text-gray-800"}>
            {currentGameState.game.winnerUuid ? gameState : "Remis"}
          </span>
        </div>

        <div className={"flex justify-center mt-4"}>
          <Board
            board={currentGameState.game.board}
            onMakeMove={() => {}}
            isMyTurn={false}
          />
        </div>

        <div
          className={
            "bg-cyan-700 hover:bg-cyan-800 text-white text-center font-bold py-2 px-4 rounded cursor-pointer mt-4"
          }
          onClick={startNewGame}
        >
          Zacznij nową grę
        </div>
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
            {isMyTurn ? "Twoja kolej" : "Oczekiwanie na ruch przeciwnika"} (
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
            Gra: {currentGameState.game.uuid}
          </span>
        </div>
      </div>
    );
  }

  if (currentGameState?.status === GameStates.USER_IN_LOBBY) {
    return (
      <div>
        <span>Podłączono do serwera</span>
        <div
          className={
            "bg-cyan-700 hover:bg-cyan-800 text-white text-center font-bold py-2 px-4 rounded cursor-pointer mt-4"
          }
          onClick={startNewGame}
        >
          Zacznij nową grę
        </div>
      </div>
    );
  }

  if (currentGameState?.status === GameStates.WAITING_FOR_PLAYERS) {
    return <div>Oczekiwanie na graczy...</div>;
  }

  return <div>Wystąpił błąd</div>;
};
