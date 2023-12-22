import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { ErrorResponse, ErrorResponseCode } from "@/lib/errors/types";
import { v4 as uuidv4 } from "uuid";
import { generateJwtTokens } from "@/lib/jwt/jwt";

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    const errorResponse: ErrorResponse = {
      error: `Method ${req.method} Not Allowed`,
      error_code: ErrorResponseCode.METHOD_NOT_ALLOWED,
    };

    res.status(StatusCodes.METHOD_NOT_ALLOWED).json(errorResponse);

    return;
  }

  try {
    const userData = {
      uuid: uuidv4(),
    };
    const tokens = generateJwtTokens(userData);
    res.status(StatusCodes.OK).json(tokens);
  } catch (error: any) {
    const errorResponse: ErrorResponse = {
      error: "Invalid email or password",
      error_code: ErrorResponseCode.INVALID_CREDENTIALS,
    };

    res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
  }
};

export default loginHandler;
