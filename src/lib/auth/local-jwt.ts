import {
  JWT_ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  JWT_REFRESH_TOKEN_LOCAL_STORAGE_KEY,
} from "@/lib/auth/config";

export const saveAccessToken = (accessToken: string) => {
  localStorage.setItem(JWT_ACCESS_TOKEN_LOCAL_STORAGE_KEY, accessToken);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(JWT_ACCESS_TOKEN_LOCAL_STORAGE_KEY);
};

export const removeAccessToken = () => {
  localStorage.removeItem(JWT_ACCESS_TOKEN_LOCAL_STORAGE_KEY);
};

export const saveRefreshToken = (refreshToken: string) => {
  localStorage.setItem(JWT_REFRESH_TOKEN_LOCAL_STORAGE_KEY, refreshToken);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(JWT_REFRESH_TOKEN_LOCAL_STORAGE_KEY);
};

export const removeRefreshToken = () => {
  localStorage.removeItem(JWT_REFRESH_TOKEN_LOCAL_STORAGE_KEY);
};
