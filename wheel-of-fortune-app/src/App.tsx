import { useState } from "react";
import Wheel from "./components/Wheel";
import { useWheelSpin } from "./components/useSpin";
import Button from "./components/Button";

const segments = [
  { label: "YOU WIN!", color: "#f87171" },
  { label: "You loose...", color: "#fbbf24" },
  { label: "You loose...", color: "#34d399" },
  { label: "You loose...", color: "#60a5fa" },
  { label: "You loose...", color: "#a78bfa" },
  { label: "You loose...", color: "#f472b6" },
];

export default function App() {
  const { angle, spin } = useWheelSpin(segments); // Custom hook to manage wheel spin

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8">
      <h1 className="text-4xl text-blue-800">Wheel of Fortune</h1>
      <p className="text-white-600">Welcome to the Wheel of fortune game.</p>
      <Wheel segments={segments} spinningAngle={angle} />
      <Button onClick={spin} className="mt-4">
        Spin the Wheel!
      </Button>
    </div>
  );
}
