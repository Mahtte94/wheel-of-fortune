// Define the props interface
interface ResultDisplayProps {
  resultMessage: string;
  winnings: number;
  apiError: string | null;
  outcomeType?: string; // Optional since it might not always be provided
}

// Update the component with proper TypeScript typing
const ResultDisplay: React.FC<ResultDisplayProps> = ({
  resultMessage,
  winnings,
  apiError,
  outcomeType,
}) => {
  // First, determine if this is an authentication error
  const isAuthError =
    apiError &&
    (apiError.includes("Authentication required") ||
      apiError.includes("auth token"));

  return (
    <div className="w-full max-w-md">
      {isAuthError ? (
        <div className="bg-red-700 text-white px-4 py-4 rounded-lg text-center">
          <p className="mb-2">{apiError}</p>
          <a
            href="https://tivoli.yrgobanken.vip"
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 inline-block mt-2"
          >
            Log in
          </a>
        </div>
      ) : apiError ? (
        <div className="bg-red-700 text-white px-4 py-3 rounded-lg">
          <p className="text-center">{apiError}</p>
        </div>
      ) : resultMessage ? (
        <div
          className={`px-4 py-3 rounded-lg text-white text-center text-xl ${
            outcomeType === "JACKPOT"
              ? "bg-yellow-600 animate-pulse"
              : outcomeType === "WIN"
              ? "bg-green-600"
              : outcomeType === "FREE_SPIN"
              ? "bg-blue-600"
              : "bg-gray-700"
          }`}
        >
          {resultMessage}
        </div>
      ) : null}
    </div>
  );
};

export default ResultDisplay;
