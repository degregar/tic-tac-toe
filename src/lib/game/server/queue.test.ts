import { PublicUser } from "@/lib/user/types";
import {
  addToQueue,
  fetchFromQueue,
  getQueueLength,
  removeFromQueue,
} from "@/lib/game/server/queue";

const playerX: PublicUser = {
  uuid: "1234",
};

const playerO: PublicUser = {
  uuid: "5678",
};

describe("Queue", () => {
  afterEach(async () => {
    await removeFromQueue(playerX);
    await removeFromQueue(playerO);
  });

  it("should add user to queue", async () => {
    // when
    await addToQueue(playerX);

    // then
    expect(await getQueueLength()).toEqual(1);
  });

  it("should add both users to queue", async () => {
    // when
    await addToQueue(playerX);
    await addToQueue(playerO);

    // then
    expect(await getQueueLength()).toEqual(2);
  });

  it("should fetch user from queue", async () => {
    // given
    await addToQueue(playerX);
    await addToQueue(playerO);

    // when
    await fetchFromQueue();

    // then
    expect(await getQueueLength()).toEqual(1);
  });

  it("should remove user from queue", async () => {
    // given
    await addToQueue(playerX);
    await addToQueue(playerO);

    // when
    await removeFromQueue(playerX);

    // then
    expect(await getQueueLength()).toEqual(1);
  });

  it("should return empty queue", async () => {
    // when
    const queueLength = await getQueueLength();

    // then
    expect(queueLength).toEqual(0);
  });

  it("should not add user to queue twice", async () => {
    // when
    await addToQueue(playerX);
    await addToQueue(playerX);

    // then
    expect(await getQueueLength()).toEqual(1);
  });
});
