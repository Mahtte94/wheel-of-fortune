import { useState, useEffect } from "react";
import { segmentsData } from "../gameConstants";

export function useGameLogic(
  isSpinning: boolean,
  winningSegmentIndex: number | null,
  addWinnings: () => number
) {
  const [playerGuessIndex, setPlayerGuessIndex] = useState<number | null>(null);
  const [lockedGuessIndex, setLockedGuessIndex] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  useEffect(() => {

    if (
      !isSpinning &&
      winningSegmentIndex !== null &&
      lockedGuessIndex !== null
    ) {
      const winningValue = segmentsData[winningSegmentIndex].label;
      const playerGuessValue = segmentsData[lockedGuessIndex].label;

      if (winningValue === playerGuessValue) {
        const payout = addWinnings();
        setResultMessage(
          `It landed on number ${winningValue}! You correctly guessed it. YOU WIN $${payout}!`
        );
      } else {
        setResultMessage(
          `It landed on number ${winningValue}. You guessed number ${playerGuessValue}. Better luck next time!`
        );
      }
      setGameCompleted(true);
    }
  }, [isSpinning, winningSegmentIndex, lockedGuessIndex, addWinnings]);

  const startNewGame = () => {
    if (playerGuessIndex !== null) {
      setLockedGuessIndex(playerGuessIndex);
    }
    setResultMessage("");
    setGameCompleted(false);
    setGameStarted(true);
  };

  const resetGame = () => {
    setResultMessage("");
    setGameCompleted(false);
    setGameStarted(false);
    setLockedGuessIndex(null);
  };

  return {
    playerGuessIndex,
    setPlayerGuessIndex,
    lockedGuessIndex,
    resultMessage,
    gameCompleted,
    gameStarted,
    startNewGame,
    resetGame,
  };
}