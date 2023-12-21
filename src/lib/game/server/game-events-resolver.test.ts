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
const testEvent: CurrentStatusRequestedEvent & { user: PublicUser } = {
  type: GameEvents.CURRENT_STATUS_REQUESTED,
  user: testUser,
};

describe("resolve game events", () => {
  it("should resolve game events for current status requested event", async () => {
    // when
    const events = await resolveGameEvents(testEvent);

    // then
    expect(events).toHaveLength(1);
  });

  it("should return game state USER_IN_LOBBY", async () => {
    // when
    const events = (await resolveGameEvents(testEvent)) as [
      CurrentStatusUpdatedEvent,
    ];

    // then
    expect(events[0].type).toEqual(GameEvents.CURRENT_STATUS_UPDATED);
    expect(events[0].state.status).toEqual(GameStates.USER_IN_LOBBY);
    expect(events[0].recipient).toEqual(testUser);
  });

  it("should return game state WAITING_FOR_PLAYERS for event NEW_MATCH_REQUESTED", async () => {
    // given
    const event: NewMatchRequestedEvent & { user: PublicUser } = {
      type: GameEvents.NEW_MATCH_REQUESTED,
      user: testUser,
    };

    // when
    const events = await resolveGameEvents(event);

    // then
    expect(events).toHaveLength(1);
  });
});
