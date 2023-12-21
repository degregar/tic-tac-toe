import {
  GameEvent,
  GameEvents,
  NewMatchRequestedEvent,
} from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { GameStates } from "@/lib/game/game-states";
import { storeUserGameState } from "@/lib/game/server/users-game-states";
import { findOpponent } from "@/lib/game/server/find-opponent";
import { createGame } from "@/lib/game/server/create-game";

export const handleNewMatchRequestedEvent = async (
  data: NewMatchRequestedEvent & { user: PublicUser },
): Promise<GameEvent[]> => {
  storeUserGameState(data.user.uuid, {
    status: GameStates.WAITING_FOR_PLAYERS,
    game: null,
  });

  // @TODO: Should start transaction here to avoid race condition
  const opponent = await findOpponent(data.user.uuid);
  if (opponent) {
    const game = await createGame(data.user.uuid, opponent.user.uuid);

    storeUserGameState(opponent.user.uuid, {
      status: GameStates.PLAYING,
      game,
    });
    storeUserGameState(data.user.uuid, {
      status: GameStates.PLAYING,
      game,
    });

    const event: GameEvent = {
      type: GameEvents.CURRENT_STATUS_UPDATED,
      state: {
        status: GameStates.PLAYING,
        game,
      },
      recipient: data.user,
    };

    const opponentEvent: GameEvent = {
      ...event,
      recipient: opponent.user,
    };

    return [event, opponentEvent];
  }

  const event: GameEvent = {
    type: GameEvents.CURRENT_STATUS_UPDATED,
    state: {
      status: GameStates.WAITING_FOR_PLAYERS,
      game: null,
    },
    recipient: data.user,
  };

  return [event];
};
