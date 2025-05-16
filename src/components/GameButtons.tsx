import Button from "./Button";
import { SPIN_COST } from "../gameConstants";

type GameButtonsProps = {
  gameStarted: boolean;
  gameCompleted: boolean;
  isSpinning: boolean;
  playerGuessIndex: number | null;
  canAffordSpin: boolean;
  onSpin: () => void;
  onPlayAgain: () => void;
};

const GameButtons = ({
  gameStarted,
  gameCompleted,
  isSpinning,
  playerGuessIndex,
  canAffordSpin,
  onSpin,
  onPlayAgain,
}: GameButtonsProps) => {
  if (!gameStarted) {
    return (
      <Button
        onClick={onSpin}
        disabled={isSpinning || playerGuessIndex === null || !canAffordSpin}
        className="mt-4 text-base md:text-lg px-6 md:px-8 py-3 z-10 w-full max-w-xs"
      >
        {isSpinning ? "Spinning..." : `Spin the Wheel! (-$${SPIN_COST})`}
      </Button>
    );
  }

  if (!gameCompleted) {
    return (
      <Button
        onClick={() => {}}
        disabled={true}
        className="mt-4 text-base md:text-lg px-6 md:px-8 py-3 z-10 w-full max-w-xs"
      >
        Spinning...
      </Button>
    );
  }

  return (
    <Button
      onClick={onPlayAgain}
      disabled={!canAffordSpin}
      className="mt-4 text-base md:text-lg px-6 md:px-8 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 z-10 w-full max-w-xs"
    >
      {canAffordSpin
        ? `Play Again ($${SPIN_COST})`
        : `Need $${SPIN_COST} to Play Again`}
    </Button>
  );
};

export default GameButtons;
