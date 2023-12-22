import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUserFromRequest } from "@/lib/auth/acl";
import { StatusCodes } from "http-status-codes";
import { ErrorResponse, ErrorResponseCode } from "@/lib/errors/types";
import { getPostgresClient } from "@/lib/postgres/db";
import { GameDto } from "@/lib/game/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    const errorResponse: ErrorResponse = {
      error: "Method not allowed",
      error_code: ErrorResponseCode.METHOD_NOT_ALLOWED,
    };

    res.status(StatusCodes.METHOD_NOT_ALLOWED).json(errorResponse);
    return;
  }

  const player = authenticateUserFromRequest(req);

  if (!player) {
    const errorResponse: ErrorResponse = {
      error: "Unauthorized",
      error_code: ErrorResponseCode.UNAUTHORIZED,
    };

    res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
    return;
  }

  const playerUuid = player.uuid;

  try {
    if (!playerUuid) {
      const errorResponse: ErrorResponse = {
        error: "Bad request",
        error_code: ErrorResponseCode.BAD_REQUEST,
      };

      res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
      return;
    }

    const query = `
      SELECT * FROM games
      WHERE player_x_uuid = $1 OR player_o_uuid = $1;
    `;

    const postgresClient = await getPostgresClient();
    const { rows } = await postgresClient.query(query, [playerUuid]);

    const games: GameDto[] = rows.map((row): GameDto => {
      return {
        uuid: row.uuid,
        playerXUuid: row.player_x_uuid,
        playerOUuid: row.player_o_uuid,
        winnerUuid: row.winner_uuid,
        turn: row.turn,
        board: row.board,
        finishedAt: row.finished_at,
      };
    });

    res.status(StatusCodes.OK).json(games);
  } catch (error) {
    console.error("Error while fetching games", error);

    const errorResponse: ErrorResponse = {
      error: "Internal server error",
      error_code: ErrorResponseCode.INTERNAL_SERVER_ERROR,
    };

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
