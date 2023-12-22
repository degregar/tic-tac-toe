"use client";

import React from "react";
import { SecuredLayout } from "@/components/layouts/SecuredLayout";
import { GameDto } from "@/lib/game/types";
import { securedAxios } from "@/lib/auth/axios";
import { useAuth } from "@/lib/hooks/useAuth";
import { Board } from "@/components/game/Board";
import Link from "next/link";
import { Spinner } from "@/components/Spinner";

const GameRecord = ({ game }: { game: GameDto }) => {
  const { user } = useAuth();

  const didIWin = game.winnerUuid === user?.uuid;

  return (
    <div>
      <div className={"text-sm text-center mb-4"}>
        <span>{game.finishedAt}</span>
      </div>
      <div className="flex flex-row justify-around items-center mb-4">
        <div>
          <Board board={game.board} />
        </div>
        <div>
          <div className="text-sm text-gray-500">You</div>
          <div className={"text-2xl text-gray-800 mb-4"}>
            {game.playerXUuid === user?.uuid ? "X" : "O"}
          </div>

          <div className="text-sm text-gray-500">Result</div>
          <div className="text-2xl text-gray-800">
            {didIWin ? "WON" : "LOST"}
          </div>
        </div>
      </div>
    </div>
  );
};

const GamesPage = () => {
  const [games, setGames] = React.useState<GameDto[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const fetchGames = async () => {
    setIsLoading(true);
    const response = await securedAxios.get("/api/games");
    setGames(response.data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    void fetchGames();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-cyan-50">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-semibold mb-6 text-cyan-800">
          Tic-Tac-Toe
        </h1>

        <div className={"text-center mb-6"}>
          <Link
            href={"/start"}
            className={
              "bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded"
            }
          >
            Play
          </Link>
        </div>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {isLoading && <Spinner />}

          {games.map((game) => (
            <GameRecord key={game.uuid} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};

const WrappedGamesPage = () => {
  return (
    <SecuredLayout>
      <GamesPage />
    </SecuredLayout>
  );
};

export default WrappedGamesPage;
