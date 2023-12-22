export enum ErrorResponseCode {
  INTERNAL_SERVER_ERROR = "internal_server_error",
  METHOD_NOT_ALLOWED = "method_not_allowed",
  UNAUTHORIZED = "unauthorized",
  BAD_REQUEST = "bad_request",
  INVALID_CREDENTIALS = "invalid_credentials",
  INVALID_OR_EXPIRED_REFRESH_TOKEN = "invalid_or_expired_refresh_token",
  MISSING_REFRESH_TOKEN = "missing_refresh_token",
}

export type ErrorResponse = {
  error: string;
  error_code: ErrorResponseCode;
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
  NOT_AUTHENTICATED = "not_authenticated",
  UNKNOWN = "unknown",
}

export type GameError = {
  error: string;
  error_code: GameErrors;
};
