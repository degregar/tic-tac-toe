export enum GameStates {
  USER_IN_LOBBY = "user-in-lobby",
  WAITING_FOR_PLAYERS = "waiting-for-players",
  IN_PROGRESS = "in-progress",
  FINISHED = "finished",
}

export type GameState = {
  status: GameStates;
};
