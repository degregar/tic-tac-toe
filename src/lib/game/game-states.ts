import { GameDto } from "@/lib/game/types";

export enum GameStates {
  USER_IN_LOBBY = "user-in-lobby",
  WAITING_FOR_PLAYERS = "waiting-for-players",
  PLAYING = "playing",
  FINISHED = "finished",
}

export type GameState = {
  status: GameStates;
  game: GameDto | null;
};
