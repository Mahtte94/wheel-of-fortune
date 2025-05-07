import { useState } from "react";
import Wheel from "./components/Wheel";

const segments = [
  { label: "YOU WIN!", color: "#f87171" },
  { label: "You loose...", color: "#fbbf24" },
  { label: "You loose...", color: "#34d399" },
  { label: "You loose...", color: "#60a5fa" },
  { label: "You loose...", color: "#a78bfa" },
  { label: "You loose...", color: "#f472b6" },
];

export default function App() {
  const [angle, setAngle] = useState(0); // Rotation angle of the wheel

  const spin = () => {
    const spins = 5 * 360; // Number of full spins (five times 360 degrees)
    const segAngle = 360 / segments.length; // Angle for each segment
    const rand = Math.floor(Math.random() * segments.length); // Random index of segment array
    const target = rand * segAngle + segAngle / 2; // Target angle for the selected segment to stop at center

    setAngle((prev) => prev + spins + target); // Update the angle state
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8">
      <h1 className="text-4xl text-blue-800">Wheel of Fortune</h1>
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
