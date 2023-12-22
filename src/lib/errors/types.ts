export type ErrorResponse = {
  error: string;
  error_code: string;
};

export enum SocketErrors {
  NO_CONNECTION = "no_connection",
}

export type SocketError = {
  error: string;
  error_code: SocketErrors;
};

export enum GameErrors {
  NO_CONNECTION = "no_connection",
  UNKNOWN = "unknown",
}

export type GameError = {
  error: string;
  error_code: GameErrors;
};
