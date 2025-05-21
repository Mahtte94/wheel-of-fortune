import Wheel from "./components/Wheel";
import { useWheelSpin } from "./components/useSpin";
import { useMoney } from "./components/useMoney";
import { useGameLogic } from "./components/useGameLogic";
import MoneyDisplay from "./components/MoneyDisplay";
import ResultDisplay from "./components/ResultDisplay";
import GetApi from "./api/Connection";
import { segmentsData } from "./gameConstants";
import { useEffect, useState } from "react";
import { decodeJwt } from "./components/decodeUtil";
import TivoliApiService from "./api/TivoliApiService";

//for deploy?
interface MyTokenPayload {
  sub: string;
  name: string;
  exp: number;
  [key: string]: any;
}

export default function App() {
  const [segments] = useState(() => segmentsData);

  const [tivoliAuthStatus, setTivoliAuthStatus] = useState<string | null>(null);
  
  // Replace your existing useEffect for token handling with this:
  useEffect(() => {
    // Check URL parameters for token from Tivoli
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      // Store token in localStorage
      localStorage.setItem("token", tokenFromUrl);
      const decoded = decodeJwt<MyTokenPayload>(tokenFromUrl);
      if (decoded) {
        console.log("Decoded JWT from Tivoli:", decoded);
        setTivoliAuthStatus("Authenticated with Tivoli");
      } else {
        setTivoliAuthStatus("Invalid token from Tivoli");
      }
    } else {
      // Check for existing token in localStorage
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = decodeJwt<MyTokenPayload>(token);
        if (decoded) {
          console.log("Using stored JWT:", decoded);

          // Check if token is expired
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp < currentTime) {
            setTivoliAuthStatus("Tivoli token expired. Please login again.");
            localStorage.removeItem("token");
          } else {
            setTivoliAuthStatus("Authenticated with Tivoli");
          }
        } else {
          setTivoliAuthStatus("Invalid stored token");
          localStorage.removeItem("token");
        }
      } else {
        setTivoliAuthStatus("Not authenticated with Tivoli");
      }
    }
  }, []);

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
    isBalanceLoading,
    addFreeSpin,
  } = useMoney();

  const { resultMessage, gameCompleted, resetGame, outcomeType, apiError } =
    useGameLogic(
      isSpinning,
      winningSegmentIndex,
      segmentsData,
      addMoney,
      addFreeSpin
    );

  const handleSpinClick = async () => {
    if (!canAffordSpin) return;

    // Since deductSpinCost now returns a Promise<boolean>, we need to await it
    const spinDeducted = await deductSpinCost();
    if (!spinDeducted) {
      // If we couldn't deduct the spin cost, don't proceed with the spin
      return;
    }

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

  const [tivoliBalance, setTivoliBalance] = useState<number | null>(null);
 





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
              tivoliBalance={playerMoney}
              canAffordSpin={canAffordSpin}
              isLoading={isBalanceLoading}
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
            <ResultDisplay
              resultMessage={resultMessage}
              winnings={0}
              apiError={apiError}
            />
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
              tivoliBalance={playerMoney}
              canAffordSpin={canAffordSpin}
              isLoading={isBalanceLoading}
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
              apiError={apiError}
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
         
<div className="mt-4 p-3 bg-gray-700 text-white rounded">
  <p>Tivoli Auth Status: {tivoliAuthStatus || "Checking..."}</p>
  <p>Token in localStorage: {localStorage.getItem("token") ? "Yes" : "No"}</p>
  <p>Balance: {playerMoney !== null ? `$${playerMoney}` : "Not loaded"}</p>
</div>
        </div>
      </div>
    </div>
  );
}
