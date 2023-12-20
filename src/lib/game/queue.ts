import { PublicUser } from "@/lib/user/types";

type SocketUser = Pick<PublicUser, "uuid"> & { _socketId: string };

let queue: {
  [key: string]: any;
} = {};

export const isInQueue = (user: Pick<PublicUser, "uuid">) => {
  return queue[user.uuid];
};

export const addToQueue = (
  user: Pick<PublicUser, "uuid">,
  socketId: string,
) => {
  queue[user.uuid] = { ...user, _socketId: socketId };
};

export const getAnotherUserFromQueue = (
  user: Pick<PublicUser, "uuid">,
): SocketUser | null => {
  const anotherUser = Object.values(queue).find(
    (queueUser) => queueUser.uuid !== user.uuid,
  );
  return anotherUser;
};

export const removeFromQueue = (user: Pick<PublicUser, "uuid">) => {
  if (isInQueue(user)) {
    delete queue[user.uuid];
  }
};
