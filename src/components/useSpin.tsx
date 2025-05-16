import { useState } from "react";

type Outcome = {
  type: string;
  weight: number;
};

export function useWheelSpin(
  segments: { label: string | number; color: string }[]
) {
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningSegmentIndex, setWinningSegmentIndex] = useState<number | null>(
    null
  );

  // Define your custom odds here
  const outcomes: Outcome[] = [
    { type: "JACKPOT", weight: 8 },
    { type: "2X WIN", weight: 8 },
    { type: "FREE SPIN", weight: 8 },
    { type: "TRY AGAIN", weight: 76 },
  ];

  const resetSpin = () => {
    setWinningSegmentIndex(null);
    setAngle(0);
  };

  // Weighted outcome roll
  const weightedRandom = (outcomes: Outcome[]) => {
    const totalWeight = outcomes.reduce((acc, o) => acc + o.weight, 0);
    const random = Math.random() * totalWeight;
    let current = 0;

    for (const outcome of outcomes) {
      current += outcome.weight;
      if (random <= current) return outcome.type;
    }
    return outcomes[outcomes.length - 1].type; // fallback
  };

  // Spin the wheel
  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinningSegmentIndex(null);

    const audio = new Audio("/sounds/spin.mp3");
    audio.playbackRate = 0.7;
    audio.play();

    // Roll outcome table
    const chosenType = weightedRandom(outcomes);

    // Pick random segment of that type
    const matchingSegments = segments
      .map((seg, i) => ({ ...seg, index: i }))
      .filter((seg) => seg.label === chosenType);

    const chosenSegment =
      matchingSegments[Math.floor(Math.random() * matchingSegments.length)];
    const targetSegmentIndex = chosenSegment.index;

    // Calculate wheel rotation
    const segmentAngle = 360 / segments.length;
    const segmentCenter = targetSegmentIndex * segmentAngle + segmentAngle / 2;
    const rotationToCenter = 270 - segmentCenter;
    const fullRotations = (Math.floor(Math.random() * 4) + 5) * 360;
    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.7;
    const totalRotation = rotationToCenter + fullRotations + randomOffset;

    setAngle(totalRotation);

    // Set winner after spin animation
    setTimeout(() => {
      setIsSpinning(false);
      setWinningSegmentIndex(targetSegmentIndex);
    }, 4000);
  };

  return { angle, spin, isSpinning, winningSegmentIndex, resetSpin };
}
