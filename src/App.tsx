import Wheel from "./components/Wheel";
import { useWheelSpin } from "./components/useSpin";
import { useMoney } from "./components/useMoney";
import { useGameLogic } from "./components/useGameLogic";
import MoneyDisplay from "./components/MoneyDisplay";
import ResultDisplay from "./components/ResultDisplay";
import JwtListener from "./components/JwtListener";
import { segmentsData } from "./gameConstants";
import { useEffect, useState } from "react";
import { decodeJwt } from "./components/decodeUtil";

interface MyTokenPayload {
  sub: string;
  name: string;
  exp: number;
  [key: string]: any;
}



export default function App() {
  const [segments] = useState(() => segmentsData);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [tivoliAuthStatus, setTivoliAuthStatus] = useState<string | null>(null);

  // Single useEffect for authentication handling
  useEffect(() => {
    const checkAuthentication = () => {
      // Check URL parameters for token first
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");

      if (tokenFromUrl) {
        // Store token in localStorage
        localStorage.setItem("token", tokenFromUrl);

        // Validate token
        const decoded = decodeJwt<MyTokenPayload>(tokenFromUrl);
        if (decoded) {

          // Check if token is expired
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp < currentTime) {
            setTivoliAuthStatus("Token expired. Please login again.");
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          } else {
            setTivoliAuthStatus("Authenticated with Tivoli (URL)");
            setIsAuthenticated(true);
          }
        } else {
          setTivoliAuthStatus("Invalid token from URL");
          setIsAuthenticated(false);
        }
        return;
      }

      // Check localStorage for existing token
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        // Skip validation for test token
        if (storedToken === "test-token-for-development") {
          setTivoliAuthStatus("Test mode enabled");
          setIsAuthenticated(true);
          return;
        }

        const decoded = decodeJwt<MyTokenPayload>(storedToken);
        if (decoded) {

          // Check if token is expired
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp < currentTime) {
            setTivoliAuthStatus("Token expired. Please login again.");
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          } else {
            setTivoliAuthStatus("Authenticated with Tivoli (stored)");
            setIsAuthenticated(true);
          }
        } else {
          setTivoliAuthStatus("Invalid stored token");
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
        return;
      }

      // No token found
      const isInIframe = window.parent !== window;
      if (process.env.NODE_ENV === "development" && !isInIframe) {
        setTivoliAuthStatus("Development - awaiting authentication");
        setIsAuthenticated(false);
      } else if (isInIframe) {
        setTivoliAuthStatus("Waiting for token from Tivoli...");
        setIsAuthenticated(false);
      } else {
        setTivoliAuthStatus("Not launched from Tivoli");
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  // Handler for when JwtListener receives a token
  const handleTokenReceived = (token: string) => {
    const decoded = decodeJwt<MyTokenPayload>(token);
    if (decoded) {
      setIsAuthenticated(true);
      setTivoliAuthStatus("Authenticated with Tivoli (postMessage)");
    } else {
      setTivoliAuthStatus("Invalid token from postMessage");
      setIsAuthenticated(false);
    }
  };



  // Game hooks
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

  // Game handlers
  const handleSpinClick = async () => {

    if (!canAffordSpin) {
      return;
    }

    const spinDeducted = await deductSpinCost();

    if (!spinDeducted) {
      return;
    }

    resetGame();
    spin();
    setTimeout(resetSpin, 5000);
  };

  // Keyboard event for spacebar spin
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && canAffordSpin && !isSpinCycleActive) {
        event.preventDefault();
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
      {/* JWT Listener for iframe communication */}
      <JwtListener onTokenReceived={handleTokenReceived} />

      {/* Authentication States */}

      <>
        {/* Mobile Layout */}
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
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:flex-row w-full">
          <div className="flex flex-col w-1/2 items-center justify-center p-6 bg-gray-800 text-gray-100">
            <h1 className="text-4xl font-bold text-blue-400 mb-4">
              Wheel of Fortune
            </h1>

            <MoneyDisplay
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

          </div>
        </div>
      </>
    </div>
  );
}
