import { GAME_CONFIG } from "../context/gameConfig";

type MoneyDisplayProps = {
  canAffordSpin: boolean;
  isLoading: boolean;
};

const MoneyDisplay = ({ 
  canAffordSpin, 
  isLoading 
}: MoneyDisplayProps) => {
  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-700 px-4 md:px-6 py-3 rounded-lg border-2 border-yellow-400">
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">Wheel of Fortune Game</p>
        </div>
        <div className="text-center mt-2">
          <p className="text-sm text-gray-400">Cost per spin: ${GAME_CONFIG.COST}</p>
        </div>
      </div>

      {!canAffordSpin && (
        <div className="bg-red-700 text-white px-4 md:px-6 py-3 rounded-lg mt-2 text-sm md:text-base">
          <p className="text-center">Transaction failed. Please try again.</p>
        </div>
      )}
      
      {isLoading && (
        <div className="bg-blue-700 text-white px-4 md:px-6 py-3 rounded-lg mt-2 text-sm md:text-base">
          <p className="text-center">Processing transaction...</p>
        </div>
      )}
    </div>
  );
};

export default MoneyDisplay;