import Wheel from "./components/Wheel";
import { useWheelSpin } from "./components/useSpin";
import { useMoney } from "./components/useMoney";
import { useGameLogic } from "./components/useGameLogic";
import MoneyDisplay from "./components/MoneyDisplay";
import NumberSelector from "./components/NumberSelector";
import ResultDisplay from "./components/ResultDisplay";
import GameButtons from "./components/GameButtons";
import GetApi from "./api/Connection";
import { segmentsData } from "./gameConstants";

export default function App() {
  const { angle, spin, isSpinning, winningSegmentIndex, resetSpin } =
    useWheelSpin(segmentsData);
  const { playerMoney, winnings, canAffordSpin, deductSpinCost, addWinnings } =
    useMoney();

  const {
    playerGuessIndex,
    setPlayerGuessIndex,
    lockedGuessIndex,
    resultMessage,
    gameCompleted,
    gameStarted,
    startNewGame,
    resetGame,
  } = useGameLogic(isSpinning, winningSegmentIndex, addWinnings);

  const handleSpinClick = () => {
    if (!canAffordSpin || playerGuessIndex === null) return;

    deductSpinCost();
    startNewGame();
    spin();
  };

  const handlePlayAgain = () => {
    if (!canAffordSpin) return;

    deductSpinCost();
    resetGame();
    startNewGame();
    spin();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 p-4 bg-gray-800 text-gray-100">
      <h1 className="text-4xl font-bold text-blue-400">Wheel of Fortune</h1>
      <p className="text-lg text-gray-300">
        Guess which number the wheel will land on!
      </p>

      <MoneyDisplay playerMoney={playerMoney} canAffordSpin={canAffordSpin} />

      <NumberSelector
        segments={segmentsData}
        selectedIndex={playerGuessIndex}
        onSelect={setPlayerGuessIndex}
        isSpinning={isSpinning}
        lockedGuessIndex={lockedGuessIndex}
      />

      <Wheel segments={segmentsData} spinningAngle={angle} />

      <GameButtons
        gameStarted={gameStarted}
        gameCompleted={gameCompleted}
        isSpinning={isSpinning}
        playerGuessIndex={playerGuessIndex}
        canAffordSpin={canAffordSpin}
        onSpin={handleSpinClick}
        onPlayAgain={handlePlayAgain}
      />

      <ResultDisplay resultMessage={resultMessage} winnings={winnings} />

      <GetApi />
    </div>
  );
}
