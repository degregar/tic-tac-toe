"use client";

import React, { useEffect } from "react";
import { SecuredLayout } from "@/components/layouts/SecuredLayout";
import { useGame } from "@/lib/hooks/useGame";
import { GameStates } from "@/lib/game/game-states";

const Game = () => {
  const { isConnected, fetchStatus, currentGameState, startNewGame } =
    useGame();
  console.log("currentGameState", currentGameState);
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

  if (currentGameState?.game) {
    return <div>Nowa gra: {currentGameState.game.uuid}</div>;
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

const StartPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-cyan-50">
      <div className="w-full max-w-xs">
        <h1 className="text-center text-2xl font-semibold mb-6 text-cyan-800">
          Tic-Tac-Toe
        </h1>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <Game />
        </div>
      </div>
    </div>
  );
};

const WrappedStartPage = () => {
  return (
    <SecuredLayout>
      <StartPage />
    </SecuredLayout>
  );
};

export default WrappedStartPage;
