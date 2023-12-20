import jwt from "jsonwebtoken";
import { accessTokenExpiresIn, refreshTokenExpiresIn } from "@/lib/auth/config";
import { PublicUser } from "@/lib/user/types";
import { jwtDecode } from "jwt-decode";

export const generateJwtTokens = (
  userData: PublicUser & { iat?: number; exp?: number },
) => {
  const { iat, exp, ...cleanedUserData } = userData;
  const jwtSecret = process.env.JWT_SECRET || "";

  const jwtAccessToken = jwt.sign(cleanedUserData, jwtSecret, {
    expiresIn: accessTokenExpiresIn,
  });

  const jwtRefreshToken = jwt.sign(cleanedUserData, jwtSecret, {
    expiresIn: refreshTokenExpiresIn,
  });

  return { jwtAccessToken, jwtRefreshToken };
};

export const verifyToken = (token: string): PublicUser | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "") as PublicUser;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    return null;
  }
};

export const refreshTokens = async (refreshToken: string) => {
  try {
    const userData = verifyToken(refreshToken);

    if (!userData) {
      throw new Error("Couldn't verify refresh token");
    }

    return generateJwtTokens(userData);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

export const decodeToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const isTokenExpiringSoon = (token: string) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken) {
    return true;
  }

  const currentTime = Date.now() / 1000;
  const expTime = decodedToken.exp;

  if (!expTime) {
    return true;
  }

  const timeLeft = expTime - currentTime;
  const bufferTime = 300;

  return timeLeft < bufferTime;
};
