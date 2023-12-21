import React from "react";
import { GameDto } from "@/lib/game/types";

type BoardProps = {
  board: GameDto["board"];
  onMakeMove: (coords: [number, number]) => void;
  isMyTurn: boolean;
};

export const Board = ({ board, onMakeMove, isMyTurn }: BoardProps) => {
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
