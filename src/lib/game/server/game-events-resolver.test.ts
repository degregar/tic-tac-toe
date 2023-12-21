import { resolveGameEvents } from "@/lib/game/server/game-events-resolver";
import {
  CurrentStatusRequestedEvent,
  CurrentStatusUpdatedEvent,
  GameEvents,
  NewMatchRequestedEvent,
} from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { GameStates } from "@/lib/game/game-states";

const testUser = {
  uuid: "1234",
};
const currentStatusEvent: CurrentStatusRequestedEvent & { user: PublicUser } = {
  type: GameEvents.CURRENT_STATUS_REQUESTED,
  user: testUser,
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
    expect(events[0].recipient).toEqual(testUser);
  });

  it("should return game state WAITING_FOR_PLAYERS after event NEW_MATCH_REQUESTED", async () => {
    // given
    const newMatchEvent: NewMatchRequestedEvent & { user: PublicUser } = {
      type: GameEvents.NEW_MATCH_REQUESTED,
      user: testUser,
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
});
