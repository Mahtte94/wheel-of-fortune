import { useState } from "react";
import Wheel from "./components/Wheel";
import { useWheelSpin } from "./components/useSpin";

const segments = [
  { label: "YOU WIN!", color: "#f87171" },
  { label: "You lose", color: "#fbbf24" },
  { label: "You lose", color: "#34d399" },
  { label: "You lose", color: "#60a5fa" },
  { label: "You lose", color: "#a78bfa" },
  { label: "You lose", color: "#f472b6" },
];

export default function App() {
  const { angle, spin } = useWheelSpin(segments); // Custom hook to manage wheel spin

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8">
      <h1 className="text-5xl text-blue-500">Wheel of Fortune</h1>
      <p className="text-white-600">Welcome to the Wheel of fortune game.</p>
      <Wheel segments={segments} spinningAngle={angle} />
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={spin}
      >
        Spin the Wheel!
      </button>
    </div>
  );
}
