import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "@/lib/errors/types";
import { refreshTokens } from "@/lib/jwt/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    const errorResponse: ErrorResponse = {
      error: `Method ${req.method} Not Allowed`,
      error_code: "method_not_allowed",
    };

    res.status(StatusCodes.METHOD_NOT_ALLOWED).json(errorResponse);

    return;
  }

  const { refreshToken } = req.body;

  if (!refreshToken) {
    const errorResponse: ErrorResponse = {
      error: "Missing refresh token.",
      error_code: "missing_refresh_token",
    };

    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  try {
    const tokens = await refreshTokens(refreshToken);
    res.status(StatusCodes.OK).json(tokens);
  } catch (error: any) {
    const errorResponse: ErrorResponse = {
      error: "Invalid or expired refresh token.",
      error_code: "invalid_or_expired_refresh_token",
    };

    res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
  }
};

export default handler;
