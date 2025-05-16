import { useState, useEffect } from "react";
import { SPIN_COST, WIN_MULTIPLIER } from "../gameConstants";

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

  useEffect(() => {
    if (!isSpinning && winningSegmentIndex !== null) {
      const result = segments[winningSegmentIndex].label;

      if (result === "JACKPOT") {
        const payout = SPIN_COST * WIN_MULTIPLIER;
        addMoney(payout);
        setResultMessage(`JACKPOT! You win $${payout}!`);
      } else if (result === "2X WIN") {
        const payout = SPIN_COST * 2;
        addMoney(payout);
        setResultMessage(`You win double! $${payout}!`);
      } else if (result === "FREE SPIN") {
        addFreeSpin();
        setResultMessage(`You got a free spin!`);
      } else {
        setResultMessage(`Try again! No winnings this time.`);
      }

      setGameCompleted(true);
    }
  }, [isSpinning, winningSegmentIndex, segments, addMoney, addFreeSpin]);

  const resetGame = () => {
    setResultMessage("");
    setGameCompleted(false);
  };

  return {
    resultMessage,
    gameCompleted,
    resetGame,
  };
}
