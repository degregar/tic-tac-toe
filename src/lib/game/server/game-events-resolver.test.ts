import { GameEvents } from "@/lib/game/events";
import { resolveGameEvents } from "@/lib/game/server/game-events-resolver";
import { CurrentStatusUpdatedEvent, GameEvent } from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";
import { GameStates } from "@/lib/game/game-states";

const testUser = {
  uuid: "1234",
};

describe("resolve game events", () => {
  it("should resolve game events for current status requested event", async () => {
    // given
    const event: GameEvent & { user: PublicUser } = {
      type: GameEvents.CURRENT_STATUS_REQUESTED,
      user: testUser,
    };

    // when
    const events = await resolveGameEvents(event);

    // then
    expect(events).toHaveLength(1);
  });

  it("should return game state USER_IN_LOBBY", async () => {
    // given
    const event: GameEvent & { user: PublicUser } = {
      type: GameEvents.CURRENT_STATUS_REQUESTED,
      user: testUser,
    };

    // when
    const events = (await resolveGameEvents(event)) as [
      CurrentStatusUpdatedEvent,
    ];

    // then
    expect(events[0].type).toEqual(GameEvents.CURRENT_STATUS_UPDATED);
    expect(events[0].state.status).toEqual(GameStates.USER_IN_LOBBY);
    expect(events[0].recipient).toEqual(testUser);
  });
});
