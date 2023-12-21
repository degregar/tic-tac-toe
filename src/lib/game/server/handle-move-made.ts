import {
  CurrentStatusUpdatedEvent,
  GameEvent,
  GameEvents,
  MoveMadeEvent,
} from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { getGame, makeMove } from "@/lib/game/server/game-controller";
import { GameDto } from "@/lib/game/types";
import { GameStates } from "@/lib/game/game-states";
import {
  getUserGameState,
  storeUserGameState,
} from "@/lib/game/server/users-game-states";

export const handleMoveMadeEvent = async (
  data: MoveMadeEvent & { user: PublicUser },
): Promise<GameEvent[]> => {
  const game = await getGame(data.gameId);

  await makeMove(game, data.user.uuid, data.move);
  const updatedGame = await getGame(data.gameId);

  const currentPlayerXGameState = await getUserGameState(
    updatedGame.playerXUuid,
  );

  const currentPlayerOGameState = await getUserGameState(
    updatedGame.playerOUuid,
  );

  if (!currentPlayerXGameState || !currentPlayerOGameState) {
    throw new Error("Players' game states not found");
  }

  const playerXGameState = {
    ...currentPlayerXGameState,
    game: updatedGame,
    status: GameStates.PLAYING,
  };
  const playerOGameState = {
    ...currentPlayerOGameState,
    game: updatedGame,
    status: GameStates.PLAYING,
  };

  await storeUserGameState(updatedGame.playerXUuid, playerXGameState);
  await storeUserGameState(updatedGame.playerOUuid, playerOGameState);

  const eventPlayerX: CurrentStatusUpdatedEvent = {
    type: GameEvents.CURRENT_STATUS_UPDATED,
    state: playerXGameState,
    recipient: {
      uuid: updatedGame.playerXUuid,
    },
  };

  const eventPlayerO: CurrentStatusUpdatedEvent = {
    type: GameEvents.CURRENT_STATUS_UPDATED,
    state: playerOGameState,
    recipient: {
      uuid: updatedGame.playerOUuid,
    },
  };

  return [eventPlayerX, eventPlayerO];
};
