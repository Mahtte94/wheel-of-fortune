import { useState, useEffect, useCallback } from "react";
import { SPIN_COST } from "../gameConstants";
import TivoliApiService from "../api/TivoliApiService";

export function useMoney() {
  const [tivoliBalance, setTivoliBalance] = useState<number | null>(null);
  const [freeSpins, setFreeSpins] = useState<number>(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch Tivoli balance on component mount and periodically
  useEffect(() => {
    const fetchTivoliBalance = async () => {
      if (!localStorage.getItem("token")) return;
      
      setIsBalanceLoading(true);
      try {
        const balance = await TivoliApiService.getUserBalance();
        setTivoliBalance(balance);
        setApiError(null);
      } catch (error) {
        console.error("Failed to fetch Tivoli balance:", error);
        setApiError("Failed to connect to Tivoli");
      } finally {
        setIsBalanceLoading(false);
      }
    };

    fetchTivoliBalance();
    
    // Refresh the balance every 30 seconds
    const intervalId = setInterval(fetchTivoliBalance, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Determine if the player can afford a spin
  const canAffordSpin = (tivoliBalance !== null && tivoliBalance >= SPIN_COST) || freeSpins > 0;

  // Deduct spin cost by reporting to Tivoli API
  const deductSpinCost = useCallback(async () => {
    if (freeSpins > 0) {
      setFreeSpins(freeSpins - 1);
      return true;
    } else if (tivoliBalance !== null && tivoliBalance >= SPIN_COST) {
      try {
        // Report the spin cost using the new reportSpin method
        await TivoliApiService.reportSpin(SPIN_COST);
        
        // Update the balance
        const newBalance = await TivoliApiService.getUserBalance();
        setTivoliBalance(newBalance);
        
        setApiError(null);
        return true;
      } catch (error) {
        console.error("Error deducting spin cost:", error);
        setApiError("Failed to process spin. Please try again.");
        return false;
      }
    }
    return false;
  }, [tivoliBalance, freeSpins]);

  // Add money by reporting a win to Tivoli API
  const addMoney = useCallback(async (amount: number) => {
    try {
      // Report the win using the new reportWinnings method
      await TivoliApiService.reportWinnings(amount);
      
      // Update the balance
      const newBalance = await TivoliApiService.getUserBalance();
      setTivoliBalance(newBalance);
      
      setApiError(null);
      return true;
    } catch (error) {
      console.error("Error adding money:", error);
      setApiError("Failed to process winnings. Please contact support.");
      return false;
    }
  }, []);

  // Add a free spin
  const addFreeSpin = useCallback(() => {
    setFreeSpins((prev) => prev + 1);
  }, []);

  return {
    playerMoney: tivoliBalance ?? 0, // Use tivoliBalance but keep the same property name
    freeSpins,
    canAffordSpin,
    deductSpinCost,
    addMoney,
    addFreeSpin,
    isBalanceLoading,
    apiError
  };
}