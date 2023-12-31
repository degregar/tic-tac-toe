export enum SocketEvents {
  CONNECT = "connect",
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  GAME_EVENT = "game-event",
}

export type JwtAccessToken = {
  jwtAccessToken: string;
};
