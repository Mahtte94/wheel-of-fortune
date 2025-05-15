import { useState, useCallback } from "react";
import { STARTING_MONEY, SPIN_COST } from "../gameConstants";

export function useMoney() {
  const [playerMoney, setPlayerMoney] = useState<number>(STARTING_MONEY);
  const [freeSpins, setFreeSpins] = useState<number>(0);

  const canAffordSpin = playerMoney >= SPIN_COST || freeSpins > 0;

  const deductSpinCost = useCallback(() => {
    if (freeSpins > 0) {
      setFreeSpins(freeSpins - 1);
    } else if (playerMoney >= SPIN_COST) {
      setPlayerMoney((prev) => prev - SPIN_COST);
    }
  }, [playerMoney, freeSpins]);

  const addMoney = useCallback((amount: number) => {
    setPlayerMoney((prev) => prev + amount);
  }, []);

  const addFreeSpin = useCallback(() => {
    setFreeSpins((prev) => prev + 1);
  }, []);

  return {
    playerMoney,
    freeSpins,
    canAffordSpin,
    deductSpinCost,
    addMoney,
    addFreeSpin,
  };
}
