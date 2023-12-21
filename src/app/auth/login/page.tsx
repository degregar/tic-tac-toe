"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";
import { unsecuredAxios } from "@/lib/auth/axios";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoggingIn(true);

    setTimeout(async () => {
      const response = await unsecuredAxios.post("/api/auth/login");

      login(response.data);

      setIsLoggingIn(false);

      setTimeout(() => {
        router.push("/start");
      }, 3000);
    }, 1000);
  };

  useEffect(() => {
    void handleLogin();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-cyan-50">
      <div className="w-full max-w-xs">
        <h1 className="text-center text-2xl font-semibold mb-6 text-cyan-800">
          Log in
        </h1>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {isLoggingIn && (
            <div className={"flex flex-col items-center justify-center gap-4"}>
              <span>Logging in...</span>
              <Spinner />
            </div>
          )}
          {isAuthenticated && (
            <p className="text-center text-gray-500 text-sm">
              Logged in. Redirecting...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
