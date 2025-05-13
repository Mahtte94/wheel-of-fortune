import React from "react";

type ResultDisplayProps = {
  resultMessage: string;
  winnings: number;
};

const ResultDisplay = ({ resultMessage, winnings }: ResultDisplayProps) => {
  if (!resultMessage) return null;

  return (
    <div className="space-y-2 w-full max-w-xs">
      <p
        className={`text-base md:text-xl text-center p-3 md:p-4 rounded-md shadow-lg font-semibold
        ${winnings > 0 ? "bg-green-600 text-white" : "bg-red-700 text-white"}`}
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