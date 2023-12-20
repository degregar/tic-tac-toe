import axios from "axios";

import { refreshAccessToken } from "@/lib/auth/refresh-jwt";
import { isTokenExpiringSoon } from "@/lib/jwt/jwt";
import { getAccessToken } from "@/lib/auth/local-jwt";

const commonConfig = {
  baseURL: process.env.NEXT_PUBLIC_URL,
};

export const unsecuredAxios = axios.create(commonConfig);
export const securedAxios = axios.create(commonConfig);

securedAxios.interceptors.request.use(
  async (config) => {
    let accessToken: string | null = getAccessToken();

    if (accessToken && isTokenExpiringSoon(accessToken)) {
      accessToken = await refreshAccessToken();
    }

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
