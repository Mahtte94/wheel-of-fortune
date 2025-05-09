import { useState } from "react";

export function useWheelSpin(
  segments: { label: string | number; color: string }[]
) {
  const [angle, setAngle] = useState(0); // Rotation angle of the wheel
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningSegmentIndex, setWinningSegmentIndex] = useState<number | null>(
    null
  );

  const resetSpin = () => {
    setWinningSegmentIndex(null);
    setAngle(0);
  };

  const getRotationForWinningSegment = (targetSegmentIndex: number) => {
    const segmentSize = 360 / segments.length;

    // Find the center angle of the target segment
    const segmentCenterAngle =
      targetSegmentIndex * segmentSize + segmentSize / 2;

    // Calculate how much to rotate so this segment center is at the pointer (270°)
    const baseRotation = 270 - segmentCenterAngle;

    // Make sure the rotation is positive
    const positiveRotation =
      baseRotation < 0 ? baseRotation + 360 : baseRotation;

    // Add multiple spins
    const spins = 5 * 360;

    // Add a small random offset for natural feel
    const offset = (Math.random() - 0.5) * (segmentSize * 0.5);

    return positiveRotation + spins + offset;
  };

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinningSegmentIndex(null); // Reset winning index before new spin

    const audio = new Audio("/sounds/spin.mp3");
    audio.playbackRate = 0.7;
    audio.play();

    // Choose a random segment to be the winner
    const randomSegmentIndex = Math.floor(Math.random() * segments.length);

    // Calculate the rotation needed to land this segment under the pointer
    const rotationNeeded = getRotationForWinningSegment(randomSegmentIndex);

    // Set the new angle (adding to current angle)
    setAngle((prevAngle) => prevAngle + rotationNeeded);

    // After animation completes, update winning segment
    setTimeout(() => {
      setIsSpinning(false);
      setWinningSegmentIndex(randomSegmentIndex);
    }, 4000);
  };

  return { angle, spin, isSpinning, winningSegmentIndex, resetSpin };
}
