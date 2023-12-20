import {
  removeAccessToken,
  removeRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "@/lib/auth/local-jwt";
import { jwtDecode } from "jwt-decode";
import { PublicUser } from "@/lib/user/types";

export const login = async (tokens: {
  jwtAccessToken: string;
  jwtRefreshToken: string;
}): Promise<PublicUser | null> => {
  saveAccessToken(tokens.jwtAccessToken);
  saveRefreshToken(tokens.jwtRefreshToken);

  try {
    return jwtDecode<PublicUser>(tokens.jwtAccessToken);
  } catch (e: any) {
    return null;
  }
};

export const logout = () => {
  removeAccessToken();
  removeRefreshToken();
};
