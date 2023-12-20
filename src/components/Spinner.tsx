import React from "react";

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center bg-cyan-50">
      <div className="w-full max-w-xs">
        <div className="bg-white rounded px-8 pt-6 pb-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-800" />
          </div>
        </div>
      </div>
    </div>
  );
};
