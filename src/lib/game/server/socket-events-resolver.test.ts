import { resolveSocketEvents } from "@/lib/game/server/socket-events-resolver";
import { GameStates } from "@/lib/game/game-states";
import { SocketEvents } from "@/lib/socket/types";
import { SocketEvent } from "@/lib/game/server/game-events-resolver";
import { CurrentStatusUpdatedEvent, GameEvents } from "@/lib/game/game-events";
import { storeSocketId } from "@/lib/game/server/users-sockets";

const testUser = {
  uuid: "1234",
};
const testSocketId = "socket-id-1234";

describe("resolve socket events", () => {
  it("should throw if the user is not connected", async () => {
    // given
    const gameEvent: CurrentStatusUpdatedEvent = {
      type: GameEvents.CURRENT_STATUS_UPDATED,
      state: {
        status: GameStates.USER_IN_LOBBY,
      },
      recipient: testUser,
    };

    // when
    try {
      await resolveSocketEvents([gameEvent]);
    } catch (error: any) {
      // then
      expect(error.message).toEqual("User is not connected");
    }

    expect.assertions(1);
  });

  it("should resolve socket events for current status updated event", async () => {
    // given
    storeSocketId(testUser.uuid, testSocketId);

    const gameEvent: CurrentStatusUpdatedEvent = {
      type: GameEvents.CURRENT_STATUS_UPDATED,
      state: {
        status: GameStates.USER_IN_LOBBY,
      },
      recipient: testUser,
    };
    const socketEvent: SocketEvent = {
      type: SocketEvents.GAME_EVENT,
      payload: gameEvent,
      socketId: testSocketId,
    };

    // when
    const events = await resolveSocketEvents([gameEvent]);

    // then
    expect(events[0]).toEqual(socketEvent);
  });
});
