import { useState, useCallback } from "react";
import TivoliApiService from "../api/TivoliApiService";

export function useMoney() {
  const [freeSpins, setFreeSpins] = useState<number>(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Simplified: We'll just assume the player always has money unless an error occurs
  const [canAfford, setCanAfford] = useState<boolean>(true);

  const deductSpinCost = useCallback(async () => {
    if (freeSpins > 0) {
      setFreeSpins(freeSpins - 1);
      return true;
    } else {
      try {
        setIsBalanceLoading(true);
        // Call transactionService via TivoliApiService
        await TivoliApiService.reportSpin();
        //Give player a stamp
        await TivoliApiService.reportStamp();

        setApiError(null);
        setCanAfford(true);
        return true;
      } catch (error) {
        console.error("Error deducting spin cost:", error);
        setApiError(
          error instanceof Error ? error.message : "Failed to process spin"
        );
        setCanAfford(false);
        return false;
      } finally {
        setIsBalanceLoading(false);
      }
    }
  }, [freeSpins]);

  const addMoney = useCallback(async (amount: number) => {
    try {
      // Call transactionService via TivoliApiService with the amount
      await TivoliApiService.reportWinnings(amount);
      setApiError(null);
      return true;
    } catch (error) {
      console.error("Error adding money:", error);
      setApiError(
        error instanceof Error ? error.message : "Failed to process winnings"
      );
      return false;
    }
  }, []);

  const addFreeSpin = useCallback(() => {
    setFreeSpins((prev) => prev + 1);
  }, []);

  return {
    playerMoney: 100, // Just a placeholder value since you don't need to show actual balance
    freeSpins,
    canAffordSpin: canAfford,
    deductSpinCost,
    addMoney,
    addFreeSpin,
    isBalanceLoading,
    apiError,
  };
}
