"use client";

import React from "react";
import { SecuredLayout } from "@/components/layouts/SecuredLayout";
import { Game } from "@/components/game/Game";
import Link from "next/link";

const StartPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-cyan-50">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-semibold mb-6 text-cyan-800">
          Tic-Tac-Toe
        </h1>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <Game />
        </div>
      </div>
      <div className={"text-center"}>
        <Link href={"/games"} className={"text-sm"}>
          Games history
        </Link>
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
