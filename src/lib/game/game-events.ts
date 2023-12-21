import { GameState } from "@/lib/game/game-states";
import { GameEvents } from "@/lib/game/events";
import { PublicUser } from "@/lib/user/types";

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

export type CurrentStatusUpdatedEvent = {
  type: GameEvents.CURRENT_STATUS_UPDATED;
  state: GameState;
} & WithRecipient;

export type GameEvent = CurrentStatusRequestedEvent | CurrentStatusUpdatedEvent;
