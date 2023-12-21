import { GameState } from "@/lib/game/game-states";
import { PublicUser } from "@/lib/user/types";

export enum GameEvents {
  CURRENT_STATUS_REQUESTED = "current-status-requested", // sent by the player who wants to start a new match
  CURRENT_STATUS_UPDATED = "current-status-updated", // sent by the server to the player who requested a new match
  NEW_MATCH_REQUESTED = "new-match-requested", // sent by the player who wants to start a new match
  PARTNER_ASSIGNED = "partner-assigned", // sent by the server to the player who requested a new match
  MATCH_READINESS_CONFIRMED = "match-readiness-confirmed", // sent by the player who confirmed their readiness to play
  MOVE_MADE = "move-made", // sent by the player who made a move
  MATCH_FINISHED = "match-finished", // sent by the server to both players when the match finishes
}

export type WithRecipient = {
  recipient: PublicUser;
};

export const isWithRecipient = (
  event: GameEvent,
): event is GameEvent & WithRecipient => {
  return (event as GameEvent & WithRecipient).recipient !== undefined;
};

export type CurrentStatusRequestedEvent = {
  type: GameEvents.CURRENT_STATUS_REQUESTED;
};

export const isCurrentStatusRequestedEvent = (
  event: GameEvent,
): event is CurrentStatusRequestedEvent => {
  return event.type === GameEvents.CURRENT_STATUS_REQUESTED;
};

export type CurrentStatusUpdatedEvent = {
  type: GameEvents.CURRENT_STATUS_UPDATED;
  state: GameState;
} & WithRecipient;

export const isCurrentStatusUpdatedEvent = (
  event: GameEvent,
): event is CurrentStatusUpdatedEvent => {
  return event.type === GameEvents.CURRENT_STATUS_UPDATED;
};

export type NewMatchRequestedEvent = {
  type: GameEvents.NEW_MATCH_REQUESTED;
};

export const isNewMatchRequestedEvent = (
  event: GameEvent,
): event is NewMatchRequestedEvent => {
  return event.type === GameEvents.NEW_MATCH_REQUESTED;
};

export type MoveMadeEvent = {
  type: GameEvents.MOVE_MADE;
  gameId: string;
  move: [number, number];
};

export const isMoveMadeEvent = (event: GameEvent): event is MoveMadeEvent => {
  return event.type === GameEvents.MOVE_MADE;
};

export type GameEvent =
  | CurrentStatusRequestedEvent
  | CurrentStatusUpdatedEvent
  | NewMatchRequestedEvent
  | MoveMadeEvent;
