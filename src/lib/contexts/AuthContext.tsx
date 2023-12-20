"use client";

import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { PublicUser } from "@/lib/user/types";
import { login, logout } from "@/lib/auth/auth";
import { getAccessToken } from "@/lib/auth/local-jwt";

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (tokens: { jwtAccessToken: string; jwtRefreshToken: string }) => void;
  logout: () => void;
  user: PublicUser | null;
  isSettled: boolean;
  token: string | null;
}>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  user: null,
  isSettled: false,
  token: null,
});

const getUserDataFromAccessToken = (accessToken: string): PublicUser | null => {
  try {
    const decodedToken = jwtDecode<PublicUser>(accessToken);
    return decodedToken;
  } catch (e: any) {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const init = async () => {
    const accessToken = getAccessToken();
    setToken(accessToken);

    if (accessToken) {
      const userData = await getUserDataFromAccessToken(accessToken);

      setUser(userData);
      setIsAuthenticated(!!userData);
    }

    setIsSettled(true);
  };

  useEffect(() => {
    void init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login: async (tokens) => {
          const userData = await login(tokens);

          if (userData) {
            setUser(userData);
            setIsAuthenticated(!!userData);
            setToken(tokens.jwtAccessToken);
          }
        },
        logout: () => {
          logout();

          setUser(null);
          setIsAuthenticated(false);
          setToken(null);
        },
        user,
        isSettled,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
