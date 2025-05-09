import { useState, useEffect } from "react";
import Wheel from "./components/Wheel";
import { useWheelSpin } from "./components/useSpin";
import Button from "./components/Button";

const segmentsData = [
  { label: 1, color: "#f87171" },
  { label: 2, color: "#fbbf24" },
  { label: 3, color: "#34d399" },
  { label: 4, color: "#60a5fa" },
  { label: 5, color: "#a78bfa" },
  { label: 6, color: "#f472b6" },
];

export default function App() {
  const { angle, spin, isSpinning, winningSegmentIndex, resetSpin } =
    useWheelSpin(segmentsData);
  const [playerGuessIndex, setPlayerGuessIndex] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  const handleSpinClick = () => {
    setResultMessage("");
    setGameCompleted(false);
    spin();
  };

  const handleReplay = () => {
    setResultMessage("");
    setPlayerGuessIndex(null);
    setGameCompleted(false);
    resetSpin();
  };

  useEffect(() => {
    if (
      !isSpinning &&
      winningSegmentIndex !== null &&
      playerGuessIndex !== null
    ) {
      const winningValue = segmentsData[winningSegmentIndex].label;
      const playerGuessValue = segmentsData[playerGuessIndex].label;

      if (winningValue === playerGuessValue) {
        setResultMessage(
          `It landed on number ${winningValue}! You correctly guessed it. YOU WIN!`
        );
      } else {
        setResultMessage(
          `It landed on number ${winningValue}. You guessed number ${playerGuessValue}. Better luck next time!`
        );
      }
      setGameCompleted(true);
    }
  }, [isSpinning, winningSegmentIndex, playerGuessIndex, segmentsData]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 p-4 bg-gray-800 text-gray-100">
      <h1 className="text-4xl font-bold text-blue-400">Wheel of Fortune</h1>
      <p className="text-lg text-gray-300">
        Guess which number the wheel will land on!
      </p>

      <div className="my-4 w-full max-w-md">
        <h2 className="text-2xl mb-3 text-center text-yellow-400">
          Make Your Guess (Pick a Number):
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {segmentsData.map((segment, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isSpinning) setPlayerGuessIndex(index);
              }}
              disabled={isSpinning}
              className={`w-full px-3 py-4 rounded-lg text-white shadow-md transition-all duration-200 ease-in-out focus:outline-none text-xl font-semibold z-10
                ${
                  isSpinning
                    ? "opacity-60"
                    : "hover:shadow-xl hover:-translate-y-0.5 transform"
                }
                ${
                  playerGuessIndex === index
                    ? "ring-4 ring-offset-2 ring-offset-gray-800 ring-white scale-105"
                    : "opacity-80 hover:opacity-100"
                }
              `}
              style={{ backgroundColor: segment.color }}
            >
              {segment.label}
            </button>
          ))}
        </div>
        {playerGuessIndex !== null && !isSpinning && !gameCompleted && (
          <p className="text-center mt-3 text-gray-300">
            You guessed:{" "}
            <span
              className="font-bold text-xl"
              style={{ color: segmentsData[playerGuessIndex].color }}
            >
              {segmentsData[playerGuessIndex].label}
            </span>
          </p>
        )}
      </div>

      <Wheel segments={segmentsData} spinningAngle={angle} />

      {!gameCompleted ? (
        <Button
          onClick={handleSpinClick}
          disabled={isSpinning || playerGuessIndex === null}
          className="mt-4 text-lg px-8 py-3 z-10"
        >
          {isSpinning ? "Spinning..." : "Spin the Wheel!"}
        </Button>
      ) : (
        <Button
          onClick={handleReplay}
          className="mt-4 text-lg px-8 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 z-10"
        >
          Play Again
        </Button>
      )}

      {resultMessage && (
        <p
          className={`mt-4 text-xl text-center p-4 rounded-md shadow-lg font-semibold
          ${
            resultMessage.includes("YOU WIN!")
              ? "bg-green-600 text-white"
              : "bg-red-700 text-white"
          }`}
        >
          {resultMessage}
        </p>
      )}
    </div>
  );
}
