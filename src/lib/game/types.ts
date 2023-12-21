export type GameDto = {
  uuid: string;
  playerXUuid: string;
  playerOUuid: string;
  winnerUuid: string | null;
  turn: "X" | "O";
  board: Array<Array<"X" | "O" | null>>;
};
