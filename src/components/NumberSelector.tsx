import React from "react";
import { WheelSegment } from "../gameConstants";

type NumberSelectorProps = {
  segments: WheelSegment[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  isSpinning: boolean;
  lockedGuessIndex: number | null;
};

const NumberSelector = ({ 
  segments, 
  selectedIndex, 
  onSelect, 
  isSpinning,
  lockedGuessIndex
}: NumberSelectorProps) => {
  return (
    <div className="my-4 w-full max-w-md">
      <h2 className="text-xl md:text-2xl mb-3 text-center text-yellow-400">
        Make Your Guess (Pick a Number):
      </h2>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {segments.map((segment, index) => (
          <button
            key={index}
            onClick={() => {
              onSelect(index);
            }}
            className={`w-full px-3 py-6 rounded-lg text-white shadow-md transition-all duration-200 ease-in-out focus:outline-none text-xl md:text-2xl font-semibold z-10
              active:scale-95 touch-manipulation
              ${
                selectedIndex === index
                  ? "ring-4 ring-offset-2 ring-offset-gray-800 ring-white scale-105"
                  : "opacity-80 hover:opacity-100"
              }
              ${
                lockedGuessIndex === index
                  ? "ring-2 ring-yellow-300"
                  : ""
              }
            `}
            style={{ backgroundColor: segment.color }}
            disabled={isSpinning}
          >
            {segment.label}
          </button>
        ))}
      </div>
      {selectedIndex !== null && (
        <p className="text-center mt-3 text-gray-300">
          Your guess:{" "}
          <span
            className="font-bold text-xl"
            style={{ color: segments[selectedIndex].color }}
          >
            {segments[selectedIndex].label}
          </span>
        </p>
      )}
    </div>
  );
};

export default NumberSelector;