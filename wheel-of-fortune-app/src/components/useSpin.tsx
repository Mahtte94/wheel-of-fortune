import { useState } from "react";

export function useWheelSpin(segments: { label: string; color: string }[]) {
  const [angle, setAngle] = useState(0); // Rotation angle of the wheel

  const spin = () => {
    const audio = new Audio("/sounds/spin.mp3");
    audio.playbackRate = 0.7; // Set playback speed for the audio
    audio.play();

    const spins = 5 * 360; // Number of full spins (five times 360 degrees)
    const segAngle = 360 / segments.length; // Angle for each segment
    const rand = Math.floor(Math.random() * segments.length); // Random index of segment array
    const offset = (Math.random() - 0.5) * (segAngle * 0.8); // Random offset for a more natural spin
    const target = rand * segAngle + segAngle / 2 + offset; // Target angle for the selected segment to stop at center

    setAngle((prev) => prev + spins + target); // Update the angle state
  };

  return { angle, spin };
}
