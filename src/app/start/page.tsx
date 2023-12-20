"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";
import { unsecuredAxios } from "@/lib/auth/axios";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { SecuredLayout } from "@/components/layouts/SecuredLayout";
import { AuthProvider } from "@/lib/contexts/AuthContext";

const StartPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-center items-center h-screen bg-cyan-50">
      <div className="w-full max-w-xs">
        <h1 className="text-center text-2xl font-semibold mb-6 text-cyan-800">
          Tic-Tac-Toe
        </h1>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"></div>
        <button
          className={
            "py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          }
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const WrappedStartPage = () => {
  return (
    <SecuredLayout>
      <StartPage />
    </SecuredLayout>
  );
};

export default WrappedStartPage;
