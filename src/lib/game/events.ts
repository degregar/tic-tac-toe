import { GameDto } from "@/lib/game/types";
import { PublicUser } from "@/lib/user/types";

export enum GameEvents {
  READY_TO_PLAY = "ready-to-play",
  NEW_GAME_STARTED = "new-game-started",
}

export type JwtAccessToken = {
  jwtAccessToken: string;
};

export type ReadyToPlayEvent = {
  type: GameEvents.READY_TO_PLAY;
};

export const isReadyToPlayEvent = (event: any): event is ReadyToPlayEvent => {
  return event.type === GameEvents.READY_TO_PLAY;
};

export type NewGameStartedEvent = {
  type: GameEvents.NEW_GAME_STARTED;
  game: GameDto;
};

export type GameEventPayload = (ReadyToPlayEvent | NewGameStartedEvent) &
  JwtAccessToken;

export type UserEventPayload = {
  user: PublicUser;
  socketId: string;
};

export type UserGameEventPayload = Omit<
  GameEventPayload,
  keyof JwtAccessToken
> &
  UserEventPayload;
