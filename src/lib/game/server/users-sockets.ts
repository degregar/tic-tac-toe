const usersSockets = new Map<string, string>();

export const storeSocketId = (userId: string, socketId: string) => {
  usersSockets.set(userId, socketId);
};

export const getSocketId = (userId: string): string | undefined => {
  return usersSockets.get(userId);
};

export const removeSocketId = (userId: string) => {
  usersSockets.delete(userId);
};
