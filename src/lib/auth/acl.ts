import { NextApiRequest } from "next";
import { PublicUser } from "@/lib/user/types";
import { verifyToken } from "@/lib/jwt/jwt";

export const getTokenFromRequest = (req: NextApiRequest): string | null => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return null;
  }
  const token = authorization.replace("Bearer ", "");
  return token;
};

export const authenticateUserFromToken = (token: string): PublicUser | null => {
  return verifyToken(token);
};

export const authenticateUserFromRequest = (
  req: NextApiRequest,
): PublicUser | null => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return null;
  }

  return authenticateUserFromToken(token);
};
