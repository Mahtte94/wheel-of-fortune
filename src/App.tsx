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
    <div className="flex flex-col md:flex-row bg-gray-800 min-h-screen">
      {/* Mobile layout - wheel on top, controls below */}
      <div className="md:hidden w-full">
        <div className="flex flex-col items-center p-4 bg-gray-800">
          <h1 className="text-3xl font-bold text-blue-400 text-center mt-2">
            Wheel of Fortune
          </h1>

          <div className="mt-4 w-full">
            <Wheel segments={segmentsData} spinningAngle={angle} />
          </div>

          <div className="mt-2 w-full flex justify-center">
            <GameButtons
              gameStarted={gameStarted}
              gameCompleted={gameCompleted}
              isSpinning={isSpinning}
              playerGuessIndex={playerGuessIndex}
              canAffordSpin={canAffordSpin}
              onSpin={handleSpinClick}
              onPlayAgain={handlePlayAgain}
            />
          </div>

          <div className="mt-4 w-full flex justify-center">
            <ResultDisplay resultMessage={resultMessage} winnings={winnings} />
          </div>

          <div className="mt-4 w-full">
            <NumberSelector
              segments={segmentsData}
              selectedIndex={playerGuessIndex}
              onSelect={setPlayerGuessIndex}
              isSpinning={isSpinning}
              lockedGuessIndex={lockedGuessIndex}
            />
          </div>

          <div className="w-full mt-2">
            <MoneyDisplay
              playerMoney={playerMoney}
              canAffordSpin={canAffordSpin}
            />
          </div>

          <div className="mt-4">
            <GetApi />
          </div>
        </div>
      </div>

      {/* Desktop layout - side by side */}
      <div className="hidden md:flex md:flex-row w-full">
        <div className="flex flex-col w-1/2 items-center justify-center p-6 bg-gray-800 text-gray-100">
          <h1 className="text-4xl font-bold text-blue-400 mb-4">
            Wheel of Fortune
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Guess which number the wheel will land on!
          </p>

          <MoneyDisplay
            playerMoney={playerMoney}
            canAffordSpin={canAffordSpin}
          />

          <div className="my-6">
            <NumberSelector
              segments={segmentsData}
              selectedIndex={playerGuessIndex}
              onSelect={setPlayerGuessIndex}
              isSpinning={isSpinning}
              lockedGuessIndex={lockedGuessIndex}
            />
          </div>

          <GameButtons
            gameStarted={gameStarted}
            gameCompleted={gameCompleted}
            isSpinning={isSpinning}
            playerGuessIndex={playerGuessIndex}
            canAffordSpin={canAffordSpin}
            onSpin={handleSpinClick}
            onPlayAgain={handlePlayAgain}
          />

          <div className="mt-6">
            <ResultDisplay resultMessage={resultMessage} winnings={winnings} />
          </div>
        </div>

        <div className="flex flex-col w-1/2 items-center justify-center p-6">
          <Wheel segments={segmentsData} spinningAngle={angle} />
          <GetApi />
        </div>
      </div>
    </div>
  );
}
