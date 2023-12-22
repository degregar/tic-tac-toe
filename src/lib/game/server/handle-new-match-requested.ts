import {
  GameEvent,
  GameEvents,
  NewMatchRequestedEvent,
} from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { GameStates } from "@/lib/game/game-states";
import { storeUserGameState } from "@/lib/game/server/users-game-states";
import { createGame } from "@/lib/game/server/game-controller";
import { addToQueue, fetchFromQueue } from "@/lib/game/server/queue";

const prepareMatch = async (
  playerAUuid: string,
  playerBUuid: string,
): Promise<GameEvent[]> => {
  try {
    const game = await createGame(playerAUuid, playerBUuid);

    await storeUserGameState(playerBUuid, {
      status: GameStates.PLAYING,
      game,
    });
    await storeUserGameState(playerAUuid, {
      status: GameStates.PLAYING,
      game,
    });

    const event: GameEvent = {
      type: GameEvents.CURRENT_STATUS_UPDATED,
      state: {
        status: GameStates.PLAYING,
        game,
      },
      recipient: {
        uuid: playerAUuid,
      },
    };
    const opponentEvent: GameEvent = {
      ...event,
      recipient: {
        uuid: playerBUuid,
      },
    };

    return [event, opponentEvent];
  } catch (e) {
    await addToQueue({
      uuid: playerBUuid,
    });

    return await addPlayerToQueue(playerAUuid);
  }
};

const addPlayerToQueue = async (playerUuid: string): Promise<GameEvent[]> => {
  await addToQueue({
    uuid: playerUuid,
  });

  await storeUserGameState(playerUuid, {
    status: GameStates.WAITING_FOR_PLAYERS,
    game: null,
  });

  const event: GameEvent = {
    type: GameEvents.CURRENT_STATUS_UPDATED,
    state: {
      status: GameStates.WAITING_FOR_PLAYERS,
      game: null,
    },
    recipient: {
      uuid: playerUuid,
    },
  };

  return [event];
};

export const handleNewMatchRequestedEvent = async (
  data: NewMatchRequestedEvent & { user: PublicUser },
): Promise<GameEvent[]> => {
  const opponentUuid = await fetchFromQueue();

  if (opponentUuid) {
    return await prepareMatch(data.user.uuid, opponentUuid);
  } else {
    return await addPlayerToQueue(data.user.uuid);
  }
};
