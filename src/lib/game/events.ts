import { GameDto } from "@/lib/game/types";
import { PublicUser } from "@/lib/user/types";

export enum GameEvents {
  READY_TO_PLAY = "ready-to-play",
  NEW_GAME_STARTED = "new-game-started",
}

export type BasicUserEventPayload = {
  user: Pick<PublicUser, "uuid">;
};

export type ReadyToPlayEvent = {
  type: GameEvents.READY_TO_PLAY;
} & BasicUserEventPayload;

export type NewGameStartedEvent = {
  type: GameEvents.NEW_GAME_STARTED;
  game: GameDto;
};

export type GameEventPayload = ReadyToPlayEvent | NewGameStartedEvent;
