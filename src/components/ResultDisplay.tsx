type ResultDisplayProps = {
  resultMessage: string;
  winnings: number;
  outcomeType?: string;
  apiError?: string | null; // Add the apiError prop
};

const ResultDisplay = ({
  resultMessage,
  winnings,
  outcomeType,
  apiError,
}: ResultDisplayProps) => {
  if (!resultMessage && !apiError) return null;

  const outcomeStyles: Record<string, string> = {
    JACKPOT: "text-yellow-200 bg-yellow-700 font-bold animate-pulse",
    "2X WIN": "text-green-100 bg-green-600 font-semibold",
    "FREE SPIN": "text-blue-100 bg-blue-600 font-semibold",
    "TRY AGAIN": "text-red-100 bg-red-700",
  };

  const styleClass = outcomeType
    ? outcomeStyles[outcomeType] ?? "text-white"
    : "text-white";

  return (
    <div className="space-y-2 w-full max-w-xs">
      {resultMessage && (
        <p
          className={`text-base md:text-xl text-center p-3 md:p-4 rounded-md shadow-lg font-semibold ${styleClass}`}
        >
          {resultMessage}
        </p>
      )}
      
      {winnings > 0 && (
        <p className="text-center text-green-400 font-bold">
          You won ${winnings}!
        </p>
      )}

      {/* Display Tivoli API error if present */}
      {apiError && (
        <div className="mt-2 p-3 bg-red-100 text-red-700 rounded-md text-sm font-medium text-center">
          {apiError}
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;