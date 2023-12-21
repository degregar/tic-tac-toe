import { handleCurrentStatusRequested } from "@/lib/game/server/handle-current-status-requested";
import { CurrentStatusRequestedEvent, GameEvents } from "@/lib/game/events";

const testUser = {
  uuid: "1234",
};

describe("handleCurrentStatusRequested", () => {
  it("should return an array with a single event", () => {
    // given
    const data: CurrentStatusRequestedEvent = {
      type: GameEvents.CURRENT_STATUS_REQUESTED,
      user: testUser,
    };

    // when
    const events = handleCurrentStatusRequested(data);

    // then
    expect(events).toHaveLength(1);
  });

  it("should return current status updated event", () => {
    // given
    const data: CurrentStatusRequestedEvent = {
      type: GameEvents.CURRENT_STATUS_REQUESTED,
      user: testUser,
    };

    // when
    const events = handleCurrentStatusRequested(data);

    // then
    expect(events[0].type).toEqual(GameEvents.CURRENT_STATUS_UPDATED);
  });
});
