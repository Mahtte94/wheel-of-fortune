import React from "react";
import { SPIN_COST } from "../gameConstants";

type MoneyDisplayProps = {
  playerMoney: number;
  canAffordSpin: boolean;
};

const MoneyDisplay = ({ playerMoney, canAffordSpin }: MoneyDisplayProps) => {
  return (
    <>
      <div className="bg-gray-700 px-6 py-3 rounded-lg border-2 border-yellow-400">
        <div className="text-center">
          <p className="text-sm text-gray-300">Your Money</p>
          <p className="text-2xl font-bold text-yellow-400">${playerMoney}</p>
        </div>
        <div className="text-center mt-2">
          <p className="text-sm text-gray-400">Cost per spin: ${SPIN_COST}</p>
        </div>
      </div>

      {!canAffordSpin && (
        <div className="bg-red-700 text-white px-6 py-3 rounded-lg">
          <p className="text-center">Not enough money to spin! You need at least ${SPIN_COST}</p>
        </div>
      )}
    </>
  );
};

export default MoneyDisplay;