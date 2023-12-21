import { GameDto } from "@/lib/game/types";
import { v4 as uuidv4 } from "uuid";

export const createGame = async (
  player1: string,
  player2: string,
): Promise<GameDto> => {
  return {
    uuid: uuidv4(),
    playerXUuid: player1,
    playerOUuid: player2,
    winnerUuid: null,
  };
};
