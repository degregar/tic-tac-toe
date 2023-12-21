import { GameDto } from "@/lib/game/types";
import { PublicUser } from "@/lib/user/types";
import { JwtAccessToken } from "@/lib/socket/types";
import { GameEvent } from "@/lib/game/game-events";

export enum GameEvents {
  CURRENT_STATUS_REQUESTED = "current-status-requested", // sent by the player who wants to start a new match
  CURRENT_STATUS_UPDATED = "current-status-updated", // sent by the server to the player who requested a new match
  NEW_MATCH_REQUESTED = "new-match-requested", // sent by the player who wants to start a new match
  PARTNER_ASSIGNED = "partner-assigned", // sent by the server to the player who requested a new match
  MATCH_READINESS_CONFIRMED = "match-readiness-confirmed", // sent by the player who confirmed their readiness to play
  MATCH_STARTED = "match-started", // sent by the server to both players when the match starts
  MOVE_MADE = "move-made", // sent by the player who made a move
  MATCH_FINISHED = "match-finished", // sent by the server to both players when the match finishes
}

export type CurrentStatusRequestedEvent = {
  type: GameEvents.CURRENT_STATUS_REQUESTED;
  user: PublicUser;
};

export const isCurrentStatusRequestedEvent = (
  event: any,
): event is CurrentStatusRequestedEvent => {
  return event.type === GameEvents.CURRENT_STATUS_REQUESTED;
};

export type MatchReadinessConfirmedEvent = {
  type: GameEvents.MATCH_READINESS_CONFIRMED;
};

export const isReadyToPlayEvent = (
  event: any,
): event is MatchReadinessConfirmedEvent => {
  return event.type === GameEvents.MATCH_READINESS_CONFIRMED;
};

export type NewGameStartedEvent = {
  type: GameEvents.MATCH_STARTED;
  game: GameDto;
};

export type GameEventPayload =
  | MatchReadinessConfirmedEvent
  | NewGameStartedEvent;

export type UserEventPayload = {
  user: PublicUser;
};

export type UserGameEventPayload = Omit<GameEvent, keyof JwtAccessToken> &
  UserEventPayload;
