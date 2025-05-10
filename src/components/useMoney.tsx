import { useState, useCallback } from "react";
import { STARTING_MONEY, SPIN_COST, WIN_MULTIPLIER } from "../gameConstants";

export function useMoney() {
  const [playerMoney, setPlayerMoney] = useState<number>(STARTING_MONEY);
  const [winnings, setWinnings] = useState<number>(0);

  const canAffordSpin = playerMoney >= SPIN_COST;

  const deductSpinCost = useCallback(() => {
    if (canAffordSpin) {
      setPlayerMoney(prev => prev - SPIN_COST);
      setWinnings(0);
    }
  }, [canAffordSpin]);

  const addWinnings = useCallback(() => {
    const payout = SPIN_COST * WIN_MULTIPLIER;
    setPlayerMoney(prev => prev + payout);
    setWinnings(payout);
    return payout;
  }, []);

  return {
    playerMoney,
    winnings,
    canAffordSpin,
    deductSpinCost,
    addWinnings,
  };
}