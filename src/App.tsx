import Wheel from "./components/Wheel";
import { useWheelSpin } from "./components/useSpin";
import { useMoney } from "./components/useMoney";
import { useGameLogic } from "./components/useGameLogic";
import MoneyDisplay from "./components/MoneyDisplay";
import ResultDisplay from "./components/ResultDisplay";
import GetApi from "./api/Connection";
import { segmentsData } from "./gameConstants";
import { useEffect, useState } from "react";
import { decodeJwt } from "./components/decodeUtil"

//for deploy?
// interface MyTokenPayload {
//   sub: string;
//   name: string;
//   exp: number;
//   [key: string]: any;
// }

export default function App() {
  const [segments] = useState(() => segmentsData);
  useEffect(() => {
    const testToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9." +
    "eyJpc3MiOiJ5cmdvYmFua2VuLnZpcCIsInN1YiI6OSwiZW1haWwiOiJtYXR0ZV9oYWxvQGxpdmUuc2UiLCJpYXQiOjE3NDc3Njc5NDksImV4cCI6MTc0Nzc4MjM0OX0." +
    "xa0vDJYaystfpk6k050O67YUh3IGSOasaYIVyX-8ikU";
  
    const decoded = decodeJwt(testToken);
    console.log("Decoded JWT for testing:", decoded);
  }, []);

  // for deploy?
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     const decoded = decodeJwt<MyTokenPayload>(token);
  //     if (decoded) {
  //       console.log("Decoded JWT:", decoded);
       
  //     }
  //   }
  // }, []);

  const {
    angle,
    spin,
    isSpinning,
    isResetting,
    isSpinCycleActive,
    winningSegmentIndex,
    resetSpin,
  } = useWheelSpin(segments);

  const {
    playerMoney,
    freeSpins,
    canAffordSpin,
    deductSpinCost,
    addMoney,
    addFreeSpin,
  } = useMoney();

  const { resultMessage, gameCompleted, resetGame, outcomeType } = useGameLogic(
    isSpinning,
    winningSegmentIndex,
    segmentsData,
    addMoney,
    addFreeSpin
  );

  const handleSpinClick = () => {
    if (!canAffordSpin) return;

    deductSpinCost();
    resetGame();
    spin();
    setTimeout(resetSpin, 5000);
  };

  //Event så att det går att snurra hjulet med mellanslag
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Kolla om tangenten är mellanslag och att knappen inte är inaktiverad
      if (event.code === "Space" && canAffordSpin && !isSpinCycleActive) {
        event.preventDefault(); // Förhindra scrollning som mellanslag normalt orsakar
        handleSpinClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canAffordSpin, isSpinCycleActive]);

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
            {isResetting && (
              <p className="text-center text-2xl text-yellow-500 bold mt-2 animate-pulse">
                Resetting wheel...
              </p>
            )}
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
              disabled={!canAffordSpin || isSpinCycleActive}
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
              disabled={!canAffordSpin || isSpinCycleActive}
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
            <ResultDisplay
              resultMessage={resultMessage}
              winnings={0}
              outcomeType={outcomeType}
            />
          </div>
        </div>

        <div className="flex flex-col w-1/2 items-center justify-center p-6">
          <Wheel segments={segmentsData} spinningAngle={angle} />
          {isResetting && (
            <p className="text-center text-2xl text-yellow-500 bold mt-2 animate-pulse">
              Resetting wheel...
            </p>
          )}

          <GetApi />
        </div>
      </div>
    </div>
  );
}
