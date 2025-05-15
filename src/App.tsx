import Wheel from "./components/Wheel";
import { useWheelSpin } from "./components/useSpin";
import { useMoney } from "./components/useMoney";
import { useGameLogic } from "./components/useGameLogic";
import MoneyDisplay from "./components/MoneyDisplay";
import ResultDisplay from "./components/ResultDisplay";
import GetApi from "./api/Connection";
import { segmentsData } from "./gameConstants";

export default function App() {
  const { angle, spin, isSpinning, winningSegmentIndex, resetSpin } =
    useWheelSpin(segmentsData);

  const {
    playerMoney,
    freeSpins,
    canAffordSpin,
    deductSpinCost,
    addMoney,
    addFreeSpin,
  } = useMoney();

  const { resultMessage, gameCompleted, resetGame } = useGameLogic(
    isSpinning,
    winningSegmentIndex,
    addMoney,
    addFreeSpin
  );

  const handleSpinClick = () => {
    if (!canAffordSpin) return;

    deductSpinCost();
    resetGame();
    spin();
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-800 min-h-screen">
      {/* Mobile */}
      <div className="md:hidden w-full">
        <div className="flex flex-col items-center p-4 bg-gray-800">
          <h1 className="text-3xl font-bold text-blue-400 text-center mt-2">
            Wheel of Fortune
          </h1>

          <div className="mt-4 w-full">
            <Wheel segments={segmentsData} spinningAngle={angle} />
          </div>

          <div className="mt-4 w-full flex justify-center">
            <MoneyDisplay
              playerMoney={playerMoney}
              canAffordSpin={canAffordSpin}
            />
          </div>

          <div className="mt-4 w-full flex justify-center">
            <button
              onClick={handleSpinClick}
              disabled={!canAffordSpin || isSpinning}
              className="px-6 py-3 bg-blue-500 text-white text-lg rounded disabled:bg-gray-500"
            >
              {isSpinning
                ? "Spinning..."
                : freeSpins > 0
                ? "Use Free Spin"
                : "Spin"}
            </button>
          </div>

          <div className="mt-6 w-full flex justify-center">
            <ResultDisplay resultMessage={resultMessage} winnings={0} />
          </div>

          <div className="mt-4">
            <GetApi />
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex md:flex-row w-full">
        <div className="flex flex-col w-1/2 items-center justify-center p-6 bg-gray-800 text-gray-100">
          <h1 className="text-4xl font-bold text-blue-400 mb-4">
            Wheel of Fortune
          </h1>

          <MoneyDisplay
            playerMoney={playerMoney}
            canAffordSpin={canAffordSpin}
          />

          <div className="mt-4">
            <button
              onClick={handleSpinClick}
              disabled={!canAffordSpin || isSpinning}
              className="px-8 py-4 bg-blue-500 text-white text-xl rounded disabled:bg-gray-500"
            >
              {isSpinning
                ? "Spinning..."
                : freeSpins > 0
                ? "Use Free Spin"
                : "Spin"}
            </button>
          </div>

          <div className="mt-6">
            <ResultDisplay resultMessage={resultMessage} winnings={0} />
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
