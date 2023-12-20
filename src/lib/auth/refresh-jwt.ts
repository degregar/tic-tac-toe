import { unsecuredAxios } from "@/lib/auth/axios";
import {
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "@/lib/auth/local-jwt";

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    const response = await unsecuredAxios.post("/api/auth/refresh", {
      refreshToken,
    });

    const { jwtAccessToken, jwtRefreshToken } = await response.data;
    saveAccessToken(jwtAccessToken);

    if (jwtRefreshToken) {
      saveRefreshToken(jwtRefreshToken);
    }

    return jwtAccessToken as string;
  } catch (error) {
    throw new Error("Failed to refresh access token");
  }

  return null;
};
