import { handleCurrentStatusRequested } from "@/lib/game/server/handle-current-status-requested";
import {
  CurrentStatusRequestedEvent,
  GameEvents,
} from "@/lib/game/game-events";
import { PublicUser } from "@/lib/user/types";

const testUser = {
  uuid: "1234",
};
const testEvent: CurrentStatusRequestedEvent & { user: PublicUser } = {
  type: GameEvents.CURRENT_STATUS_REQUESTED,
  user: testUser,
};

describe("handleCurrentStatusRequested", () => {
  it("should return an array with a single event", async () => {
    // when
    const events = await handleCurrentStatusRequested(testEvent);

    // then
    expect(events).toHaveLength(1);
  });

  it("should return current status updated event", async () => {
    // when
    const events = await handleCurrentStatusRequested(testEvent);

    // then
    expect(events[0].type).toEqual(GameEvents.CURRENT_STATUS_UPDATED);
  });
});
