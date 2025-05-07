import { useState } from "react";
import Wheel from "./components/Wheel";

const segments = [
  { label: "1", color: "#f87171" },
  { label: "2", color: "#fbbf24" },
  { label: "3", color: "#34d399" },
  { label: "4", color: "#60a5fa" },
  { label: "5", color: "#a78bfa" },
  { label: "6", color: "#f472b6" },
];

export default function App() {
  const [angle, setAngle] = useState(0);

  const spin = () => {
    const spins = 5 * 360;
    const segAngle = 360 / segments.length;
    const rand = Math.floor(Math.random() * segments.length);
    const target = rand * segAngle + segAngle / 2;

    setAngle((prev) => prev + spins + target);
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
