"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { SecuredLayout } from "@/components/layouts/SecuredLayout";
import { useGame } from "@/lib/hooks/useGame";

const StartPage = () => {
  const { user, logout } = useAuth();
  const { connect, isConnected, findPartner, currentGame } = useGame();

  useEffect(() => {
    void connect();
  }, []);

  useEffect(() => {
    if (isConnected) {
      void findPartner();
    }
  }, [isConnected]);

  return (
    <div className="flex justify-center items-center h-screen bg-cyan-50">
      <div className="w-full max-w-xs">
        <h1 className="text-center text-2xl font-semibold mb-6 text-cyan-800">
          Tic-Tac-Toe
        </h1>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {currentGame ? (
            <div>Nowa gra: {currentGame.uuid}</div>
          ) : (
            <div>Wyszukiwanie partnera...</div>
          )}
        </div>
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
