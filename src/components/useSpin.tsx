import { useState } from "react";

export function useWheelSpin(
  segments: { label: string | number; color: string }[]
) {
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningSegmentIndex, setWinningSegmentIndex] = useState<number | null>(null);

  const resetSpin = () => {
    setWinningSegmentIndex(null);
    setAngle(0);
  };

  const calculateActualWinningSegment = (finalAngle: number) => {
    // Normalize the angle to 0-360 range
    const normalizedAngle = ((finalAngle % 360) + 360) % 360;
    
    // The pointer is at 270 degrees
    // Calculate which segment is under the pointer
    const segmentAngle = 360 / segments.length;
    
    // Find which segment the pointer (at 270°) is pointing to
    // We need to account for the wheel's rotation
    const pointerPosition = (270 - normalizedAngle + 360) % 360;
    const segmentIndex = Math.floor(pointerPosition / segmentAngle);
    
    return segmentIndex;
  };

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinningSegmentIndex(null);

    const audio = new Audio("/sounds/spin.mp3");
    audio.playbackRate = 0.7;
    audio.play();

    // Choose a random winning segment
    const targetSegmentIndex = Math.floor(Math.random() * segments.length);
    
    // Calculate the angle needed to land on this segment
    const segmentAngle = 360 / segments.length;
    const segmentCenter = targetSegmentIndex * segmentAngle + segmentAngle / 2;
    
    // To put this segment under the pointer (at 270°), we need to rotate
    const rotationToCenter = 270 - segmentCenter;
    
    // Add full rotations (5-8 full spins)
    const fullRotations = (Math.floor(Math.random() * 4) + 5) * 360;
    
    // Add some random offset for natural feel
    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.7;
    
    // Calculate total rotation needed
    const totalRotation = rotationToCenter + fullRotations + randomOffset;
    
    // Apply the rotation
    const newAngle = angle + totalRotation;
    setAngle(newAngle);
    
    // After animation completes, verify the actual winning segment
    setTimeout(() => {
      const actualWinningIndex = calculateActualWinningSegment(newAngle);
      setIsSpinning(false);
      setWinningSegmentIndex(actualWinningIndex);
    }, 4000);
  };

  return { angle, spin, isSpinning, winningSegmentIndex, resetSpin };
}