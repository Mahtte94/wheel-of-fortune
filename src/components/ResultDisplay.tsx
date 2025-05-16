type ResultDisplayProps = {
  resultMessage: string;
  winnings: number;
  outcomeType?: string;
};

const ResultDisplay = ({
  resultMessage,
  winnings,
  outcomeType,
}: ResultDisplayProps) => {
  if (!resultMessage) return null;

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
      <p
        className={`text-base md:text-xl text-center p-3 md:p-4 rounded-md shadow-lg font-semibold ${styleClass}`}
      >
        {resultMessage}
      </p>
      {winnings > 0 && (
        <p className="text-center text-green-400 font-bold">
          You won ${winnings}!
        </p>
      )}
    </div>
  );
};

export default ResultDisplay;
