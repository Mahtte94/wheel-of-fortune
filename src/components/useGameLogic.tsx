import { useState, useEffect } from "react";
import { SPIN_COST, WIN_MULTIPLIER } from "../gameConstants";
import TivoliApiService from "../api/TivoliApiService";

type Segment = { label: string | number; color: string };

export function useGameLogic(
  isSpinning: boolean,
  winningSegmentIndex: number | null,
  segments: Segment[],
  addMoney: (amount: number) => void,
  addFreeSpin: () => void
) {
  const [resultMessage, setResultMessage] = useState<string>("");
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [outcomeType, setOutcomeType] = useState<string | undefined>();
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSpinning && winningSegmentIndex !== null) {
      const result = segments[winningSegmentIndex].label;
      let payout = 0;
      let outcomeTypeValue = "";

      if (result === "JACKPOT") {
        payout = SPIN_COST * WIN_MULTIPLIER;
        addMoney(payout);
        setResultMessage(`JACKPOT! You win $${payout}!`);
        outcomeTypeValue = "JACKPOT";
      } else if (result === "2X WIN") {
        payout = SPIN_COST * 2;
        addMoney(payout);
        setResultMessage(`You win double! $${payout}!`);
        outcomeTypeValue = "2X_WIN";
      } else if (result === "FREE SPIN") {
        addFreeSpin();
        setResultMessage(`You got a free spin!`);
        outcomeTypeValue = "FREE_SPIN";
      } else {
        setResultMessage(`Try again! No winnings this time.`);
        outcomeTypeValue = "TRY_AGAIN";
      }

      setOutcomeType(outcomeTypeValue);
      
      // Report result to Tivoli API if there's a payout
      if (payout > 0) {
        reportResultToTivoliApi(payout);
      }

      setGameCompleted(true);
    }
  }, [isSpinning, winningSegmentIndex, segments, addMoney, addFreeSpin]);

  const reportResultToTivoliApi = async (amount: number) => {
    try {
      // Only report positive winnings to the API
      if (amount > 0) {
        // Use the new reportWinnings method that now expects just the amount
        await TivoliApiService.reportWinnings(amount);
      }
      setApiError(null);
    } catch (error) {
      console.error("Failed to report game result to Tivoli API", error);
      setApiError("Failed to report winnings. Please try again later.");
    }
  };

  const resetGame = () => {
    setResultMessage("");
    setGameCompleted(false);
    setOutcomeType(undefined);
    setApiError(null);
  };

  return {
    resultMessage,
    gameCompleted,
    resetGame,
    outcomeType,
    apiError
  };
}