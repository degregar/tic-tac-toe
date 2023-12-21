import { GameEvents, NewMatchRequestedEvent } from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { resolveGameEvents } from "@/lib/game/server/game-events-resolver";

export const createTestGameUsingEvents = async (
  playerX: PublicUser,
  playerO: PublicUser,
): Promise<void> => {
  const newMatchEvent: NewMatchRequestedEvent & { user: PublicUser } = {
    type: GameEvents.NEW_MATCH_REQUESTED,
    user: playerX,
  };
  const newMatchEvent2: NewMatchRequestedEvent & { user: PublicUser } = {
    type: GameEvents.NEW_MATCH_REQUESTED,
    user: playerO,
  };

  await resolveGameEvents(newMatchEvent);
  await resolveGameEvents(newMatchEvent2);
};
