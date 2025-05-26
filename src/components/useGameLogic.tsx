import { useState, useEffect } from "react";
import { GAME_CONFIG } from "../context/gameConfig";

type Segment = { label: string | number; color: string };

export function useGameLogic(
  isSpinning: boolean,
  winningSegmentIndex: number | null,
  segments: Segment[],
  addMoney: (amount: number, isJackpot?: boolean) => Promise<boolean>,
  addFreeSpin: () => void
) {
  const [resultMessage, setResultMessage] = useState<string>("");
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [outcomeType, setOutcomeType] = useState<string | undefined>();
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const processWin = async () => {
      if (!isSpinning && winningSegmentIndex !== null) {
        const result = segments[winningSegmentIndex].label;
        let payout = 0;
        let message = "";
        let type: string | undefined;
        let isJackpot = false;

        switch (result) {
          case "JACKPOT":
            payout = GAME_CONFIG.COST * GAME_CONFIG.JACKPOT_MULTIPLIER;
            message = `JACKPOT! You win ${GAME_CONFIG.CURRENCY}${payout} and a bonus stamp!`;
            type = "JACKPOT";
            isJackpot = true;
            break;
          case "WIN":
            payout = GAME_CONFIG.COST * GAME_CONFIG.DOUBLE_WIN_MULTIPLIER;
            message = `You win! ${GAME_CONFIG.CURRENCY}${payout}!`;
            type = "WIN";
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

        // Only if player won money
        if (payout > 0) {
          // addMoney now handles both the payout and bonus stamp for jackpots
          const success = await addMoney(payout, isJackpot);
          if (!success) {
            setApiError("Failed to process winnings");
          } else {
            setApiError(null);
          }
        }

        setResultMessage(message);
        setOutcomeType(type);
        setGameCompleted(true);
      }
    };

    processWin();
  }, [isSpinning, winningSegmentIndex, segments, addMoney, addFreeSpin]);

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