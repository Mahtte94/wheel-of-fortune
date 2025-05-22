import { useState, useEffect } from "react";
import { GAME_CONFIG } from "../context/gameConfig";
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
      let message = "";
      let type: string | undefined;

      switch (result) {
        case "JACKPOT":
          payout = GAME_CONFIG.COST * GAME_CONFIG.JACKPOT_MULTIPLIER;
          message = `JACKPOT! You win ${GAME_CONFIG.CURRENCY}${payout}!`;
          type = "JACKPOT";
          break;
        case "2X WIN":
          payout = GAME_CONFIG.COST * GAME_CONFIG.DOUBLE_WIN_MULTIPLIER;
          message = `You win double! ${GAME_CONFIG.CURRENCY}${payout}!`;
          type = "2X_WIN";
          break;
        case "FREE SPIN":
          addFreeSpin();
          message = "You got a free spin!";
          type = "FREE_SPIN";
          break;
        case "TRY AGAIN":
        default:
          message = "Try again! No winnings this time.";
          type = "TRY_AGAIN";
          break;
      }

      // Endast om man vunnit pengar
      if (payout > 0) {
        addMoney(payout);
        reportResultToTivoliApi(payout);
      }

      setResultMessage(message);
      setOutcomeType(type);
      setGameCompleted(true);
    }
  }, [isSpinning, winningSegmentIndex, segments, addMoney, addFreeSpin]);

  const reportResultToTivoliApi = async (amount: number) => {
    try {
      if (amount > 0) {
        await TivoliApiService.reportWinnings();
      }
      setApiError(null);
    } catch (error) {
      console.error("Failed to report game result to Tivoli API", error);
      setApiError(
        error instanceof Error ? error.message : "Failed to report winnings"
      );
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
    apiError,
  };
}
