import React from "react";
import { GAME_CONFIG } from "../context/gameConfig";

type MoneyDisplayProps = {
  tivoliBalance: number | null;
  isLoading: boolean;
  canAffordSpin: boolean;
};

const MoneyDisplay = ({ 
  tivoliBalance, 
  isLoading, 
  canAffordSpin 
}: MoneyDisplayProps) => {
  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-700 px-4 md:px-6 py-3 rounded-lg border-2 border-yellow-400">
        <div className="text-center">
          <p className="text-sm text-gray-300">Tivoli Balance</p>
          {isLoading ? (
            <p className="text-2xl font-bold text-yellow-400 animate-pulse">Loading...</p>
          ) : tivoliBalance === null ? (
            <p className="text-lg text-red-400">Not connected to Tivoli</p>
          ) : (
            <p className="text-2xl font-bold text-yellow-400">${tivoliBalance}</p>
          )}
        </div>
        <div className="text-center mt-2">
          <p className="text-sm text-gray-400">Cost per spin: ${GAME_CONFIG.COST}</p>
        </div>
      </div>

      {!canAffordSpin && (
        <div className="bg-red-700 text-white px-4 md:px-6 py-3 rounded-lg mt-2 text-sm md:text-base">
          <p className="text-center">Not enough money to spin! You need at least ${GAME_CONFIG.COST}</p>
        </div>
      )}
    </div>
  );
};

export default MoneyDisplay;