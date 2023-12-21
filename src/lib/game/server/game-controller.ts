import { GameDto } from "@/lib/game/types";
import { v4 as uuidv4 } from "uuid";

const games = new Map<string, GameDto>();

export const createGame = async (
  player1: string,
  player2: string,
): Promise<GameDto> => {
  const game: GameDto = {
    uuid: uuidv4(),
    playerXUuid: player1,
    playerOUuid: player2,
    winnerUuid: null,
    turn: "X",
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  };

  await saveGame(game);

  return game;
};

export const saveGame = async (game: GameDto): Promise<void> => {
  games.set(game.uuid, game);
};

export const getGame = async (uuid: string): Promise<GameDto> => {
  const game = games.get(uuid);

  if (!game) {
    throw new Error(`Game ${uuid} not found`);
  }

  return game;
};

const isValidMove = (game: GameDto, move: [number, number]): boolean => {
  return move[0] >= 0 && move[0] <= 2 && move[1] >= 0 && move[1] <= 2;
};

const isFieldOccupied = (game: GameDto, move: [number, number]): boolean => {
  return game.board[move[0]][move[1]] !== null;
};

export const makeMove = async (
  game: GameDto,
  playerUuid: string,
  move: [number, number],
): Promise<GameDto> => {
  if (game.turn === "X" && game.playerXUuid !== playerUuid) {
    throw new Error("Not your turn!");
  }

  if (!isValidMove(game, move)) {
    throw new Error("Invalid move!");
  }

  if (isFieldOccupied(game, move)) {
    throw new Error("Field occupied!");
  }

  game.board[move[0]][move[1]] = game.turn;

  const updatedGame: GameDto = {
    ...game,
    turn: game.turn === "X" ? "O" : "X",
  };

  await saveGame(updatedGame);

  return updatedGame;
};
