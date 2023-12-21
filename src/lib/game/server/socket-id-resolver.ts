import { PublicUser } from "@/lib/user/types";
import { getSocketId } from "@/lib/game/server/users-sockets";

export const resolveSocketId = async (
  recipient: PublicUser,
): Promise<string> => {
  const socketId = await getSocketId(recipient.uuid);

  if (!socketId) {
    throw new Error("Socket ID not found");
  }

  return socketId;
};
