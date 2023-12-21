"use client";

import React, { useEffect } from "react";
import { SecuredLayout } from "@/components/layouts/SecuredLayout";
import { useGame } from "@/lib/hooks/useGame";
import { GameStates } from "@/lib/game/game-states";
import { GameDto } from "@/lib/game/types";

type BoardProps = {
  board: GameDto["board"];
  onMakeMove: (coords: [number, number]) => void;
  isMyTurn: boolean;
};
const Board = ({ board, onMakeMove, isMyTurn }: BoardProps) => {
  const renderCell = (coords: [number, number]) => {
    const cell = board[coords[0]][coords[1]];

    if (cell === null) {
      return (
        <div
          className={`w-16 h-16 border border-gray-300 ${
            isMyTurn ? "cursor-pointer hover:bg-gray-100" : "cursor-not-allowed"
          }`}
          onClick={() => onMakeMove(coords)}
        />
      );
    }

    return (
      <div
        className={
          "w-16 h-16 border border-gray-300 flex justify-center items-center"
        }
      >
        {cell}
      </div>
    );
  };

  return (
    <div className={"grid grid-cols-[64px_64px_64px]"}>
      {board.map((row, rowIndex) => (
        <div className={"grid grid-rows-[64px_64px_64px] gap-0"} key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <div className={"w-min grow-0"} key={cellIndex}>
              {renderCell([rowIndex, cellIndex])}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Game = () => {
  const {
    isConnected,
    fetchStatus,
    currentGameState,
    startNewGame,
    isMyTurn,
    makeMove,
  } = useGame();

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
    const handleMakeMove = (coords: [number, number]) => {
      if (isMyTurn) {
        void makeMove(coords);
      }
    };

    return (
      <div className={"flex flex-col gap-4"}>
        <div className={"text-center"}>
          <span className={"text-xs text-gray-800"}>
            {isMyTurn ? "Twoja kolej" : "Oczekiwanie na ruch przeciwnika"}
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

const StartPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-cyan-50">
      <div className="w-full max-w-md">
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
