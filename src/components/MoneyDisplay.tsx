import { GAME_CONFIG } from "../context/gameConfig";

type MoneyDisplayProps = {
  canAffordSpin: boolean;
  isLoading: boolean;
};

const MoneyDisplay = ({ canAffordSpin, isLoading }: MoneyDisplayProps) => {
  return (
    <div className="w-50 max-w-md">
      <div className="bg-gray-700 px-4 md:px-6 py-2 rounded-lg">
        <div className="text-center">
          <p className="text-lg text-white">
            Cost per spin: €{GAME_CONFIG.COST}
          </p>
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
