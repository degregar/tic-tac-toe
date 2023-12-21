import { resolveGameEvents } from "@/lib/game/server/game-events-resolver";
import {
  CurrentStatusRequestedEvent,
  CurrentStatusUpdatedEvent,
  GameEvents,
  MoveMadeEvent,
  NewMatchRequestedEvent,
} from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { GameStates } from "@/lib/game/game-states";
import { createTestGameUsingEvents } from "@/lib/game/server/game-test-utils";

const playerX = {
  uuid: "1234",
};

const playerO = {
  uuid: "5678",
};

const currentStatusEvent: CurrentStatusRequestedEvent & { user: PublicUser } = {
  type: GameEvents.CURRENT_STATUS_REQUESTED,
  user: playerX,
};

describe("resolve game events", () => {
  it("should resolve game events for current status requested event", async () => {
    // when
    const events = await resolveGameEvents(currentStatusEvent);

    // then
    expect(events).toHaveLength(1);
  });

  it("should return game state USER_IN_LOBBY", async () => {
    // when
    const events = (await resolveGameEvents(currentStatusEvent)) as [
      CurrentStatusUpdatedEvent,
    ];

    // then
    expect(events[0].type).toEqual(GameEvents.CURRENT_STATUS_UPDATED);
    expect(events[0].state.status).toEqual(GameStates.USER_IN_LOBBY);
    expect(events[0].recipient).toEqual(playerX);
  });

  it("should return game state WAITING_FOR_PLAYERS after event NEW_MATCH_REQUESTED", async () => {
    // given
    const newMatchEvent: NewMatchRequestedEvent & { user: PublicUser } = {
      type: GameEvents.NEW_MATCH_REQUESTED,
      user: playerX,
    };

    // when
    const newMatchEvents = (await resolveGameEvents(newMatchEvent)) as [
      CurrentStatusUpdatedEvent,
    ];
    const statusEvents = (await resolveGameEvents(currentStatusEvent)) as [
      CurrentStatusUpdatedEvent,
    ];

    // then
    expect(newMatchEvents[0].type).toEqual(GameEvents.CURRENT_STATUS_UPDATED);
    expect(newMatchEvents[0].state.status).toEqual(
      GameStates.WAITING_FOR_PLAYERS,
    );
    expect(statusEvents[0].type).toEqual(GameEvents.CURRENT_STATUS_UPDATED);
    expect(statusEvents[0].state.status).toEqual(
      GameStates.WAITING_FOR_PLAYERS,
    );
  });

  it("should return game state PLAYING when two users got matched", async () => {
    // given
    const newMatchEvent: NewMatchRequestedEvent & { user: PublicUser } = {
      type: GameEvents.NEW_MATCH_REQUESTED,
      user: playerX,
    };
    const newMatchEvent2: NewMatchRequestedEvent & { user: PublicUser } = {
      type: GameEvents.NEW_MATCH_REQUESTED,
      user: playerO,
    };

    // when
    await resolveGameEvents(newMatchEvent);
    const inProgressEvents = (await resolveGameEvents(newMatchEvent2)) as [
      CurrentStatusUpdatedEvent,
      CurrentStatusUpdatedEvent,
    ];

    // then
    expect(inProgressEvents[0].type).toEqual(GameEvents.CURRENT_STATUS_UPDATED);
    expect(inProgressEvents[0].state.status).toEqual(GameStates.PLAYING);

    expect(inProgressEvents[1].type).toEqual(GameEvents.CURRENT_STATUS_UPDATED);
    expect(inProgressEvents[1].state.status).toEqual(GameStates.PLAYING);
  });

  it("should return game state with one move after event MOVE_MADE", async () => {
    await createTestGameUsingEvents(playerX, playerO);

    const currentGameStatusEvent: CurrentStatusRequestedEvent & {
      user: PublicUser;
    } = {
      type: GameEvents.CURRENT_STATUS_REQUESTED,
      user: playerX,
    };
    const currentGameState = (await resolveGameEvents(
      currentGameStatusEvent,
    )) as [CurrentStatusUpdatedEvent];

    if (!currentGameState[0].state.game) {
      throw new Error("Game state is not defined");
    }

    const moveMadeEvent: MoveMadeEvent & { user: PublicUser } = {
      type: GameEvents.MOVE_MADE,
      user: playerO,
      move: [0, 0],
      gameId: currentGameState[0].state.game.uuid,
    };

    const inProgressEvents = (await resolveGameEvents(moveMadeEvent)) as [
      CurrentStatusUpdatedEvent,
      CurrentStatusUpdatedEvent,
    ];

    // then
    expect(inProgressEvents).toHaveLength(2);
    expect(inProgressEvents[0].state.game?.turn).toEqual("O");
  });

  it("should mark game as finished without winner when no more moves available", async () => {
    // given
    await createTestGameUsingEvents(playerX, playerO);

    const currentGameStatusEvent: CurrentStatusRequestedEvent & {
      user: PublicUser;
    } = {
      type: GameEvents.CURRENT_STATUS_REQUESTED,
      user: playerX,
    };
    const currentGameState = (await resolveGameEvents(
      currentGameStatusEvent,
    )) as [CurrentStatusUpdatedEvent];

    if (!currentGameState[0].state.game) {
      throw new Error("Game state is not defined");
    }

    const moveMadeEvent: MoveMadeEvent & { user: PublicUser } = {
      type: GameEvents.MOVE_MADE,
      user: playerO,
      move: [0, 0],
      gameId: currentGameState[0].state.game.uuid,
    };
    const moveMadeEvent2: MoveMadeEvent & { user: PublicUser } = {
      type: GameEvents.MOVE_MADE,
      user: playerX,
      move: [1, 0],
      gameId: currentGameState[0].state.game.uuid,
    };
    const moveMadeEvent3: MoveMadeEvent & { user: PublicUser } = {
      type: GameEvents.MOVE_MADE,
      user: playerO,
      move: [0, 1],
      gameId: currentGameState[0].state.game.uuid,
    };
    const moveMadeEvent4: MoveMadeEvent & { user: PublicUser } = {
      type: GameEvents.MOVE_MADE,
      user: playerX,
      move: [1, 1],
      gameId: currentGameState[0].state.game.uuid,
    };
    const moveMadeEvent5: MoveMadeEvent & { user: PublicUser } = {
      type: GameEvents.MOVE_MADE,
      user: playerO,
      move: [2, 0],
      gameId: currentGameState[0].state.game.uuid,
    };
    const moveMadeEvent6: MoveMadeEvent & { user: PublicUser } = {
      type: GameEvents.MOVE_MADE,
      user: playerX,
      move: [2, 1],
      gameId: currentGameState[0].state.game.uuid,
    };
    const moveMadeEvent7: MoveMadeEvent & { user: PublicUser } = {
      type: GameEvents.MOVE_MADE,
      user: playerO,
      move: [2, 2],
      gameId: currentGameState[0].state.game.uuid,
    };
    const moveMadeEvent8: MoveMadeEvent & { user: PublicUser } = {
      type: GameEvents.MOVE_MADE,
      user: playerX,
      move: [0, 2],
      gameId: currentGameState[0].state.game.uuid,
    };
    const moveMadeEvent9: MoveMadeEvent & { user: PublicUser } = {
      type: GameEvents.MOVE_MADE,
      user: playerO,
      move: [1, 2],
      gameId: currentGameState[0].state.game.uuid,
    };

    // when
    await resolveGameEvents(moveMadeEvent);
    await resolveGameEvents(moveMadeEvent2);
    await resolveGameEvents(moveMadeEvent3);
    await resolveGameEvents(moveMadeEvent4);
    await resolveGameEvents(moveMadeEvent5);
    await resolveGameEvents(moveMadeEvent6);
    await resolveGameEvents(moveMadeEvent7);
    await resolveGameEvents(moveMadeEvent8);

    const finishedEvents = (await resolveGameEvents(moveMadeEvent9)) as [
      CurrentStatusUpdatedEvent,
      CurrentStatusUpdatedEvent,
    ];

    // then
    expect(finishedEvents[0].state.game?.winnerUuid).toEqual(null);
    expect(finishedEvents[0].state.status).toEqual(GameStates.FINISHED);
  });
});
