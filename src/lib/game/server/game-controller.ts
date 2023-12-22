import { GameDto } from "@/lib/game/types";
import { v4 as uuidv4 } from "uuid";
import { GameStates } from "@/lib/game/game-states";

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
    finishedAt: null,
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

const isEveryFieldOccupied = (game: GameDto): boolean => {
  return game.board.every((row) => row.every((field) => field !== null));
};

export const isGameFinished = (game: GameDto): boolean => {
  return !!game.winnerUuid || isEveryFieldOccupied(game);
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

  if (isGameFinished(game)) {
    throw new Error("Game is finished!");
  }

  game.board[move[0]][move[1]] = game.turn;

  const updatedGame: GameDto = {
    ...game,
    turn: game.turn === "X" ? "O" : "X",
  };

  const winner = await getGameWinner(game);
  if (winner) {
    updatedGame.winnerUuid =
      winner === "X" ? game.playerXUuid : game.playerOUuid;
  }

  await saveGame(updatedGame);

  return updatedGame;
};

export const getGameWinner = async (
  game: GameDto,
): Promise<GameDto["turn"] | null> => {
  const board = game.board;

  const winningCombinations = [
    // rows
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],

    // columns
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],

    // diagonals
    [board[0][0], board[1][1], board[2][2]],
    [board[2][0], board[1][1], board[0][2]],
  ];

  for (const combination of winningCombinations) {
    if (
      combination[0] !== null &&
      combination[0] === combination[1] &&
      combination[1] === combination[2]
    ) {
      return combination[0];
    }
  }

  return null;
};
