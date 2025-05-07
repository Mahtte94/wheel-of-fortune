import React from 'react';
import { CarState } from '../types/car';
import { useCarLogic } from '../hooks/useCarLogic';

interface CarProps {
  id: number;
  name: string;
  color: string;
  speed: number;
  acceleration: number;
  handling: number;
  initialPosition: { x: number; y: number };
  initialRotation: number;
  isPlayer?: boolean;
}

const Car: React.FC<CarProps> = ({
  id,
  name,
  color,
  speed,
  acceleration,
  handling,
  initialPosition,
  initialRotation,
  isPlayer = false,
}) => {
  // Connect to car logic hook to handle game mechanics
  const {
    position,
    rotation,
    velocity,
    isAccelerating,
    handleAccelerate,
    handleTurnLeft,
    handleTurnRight,
  } = useCarLogic({
    id,
    initialPosition,
    initialRotation,
    maxSpeed: speed,
    acceleration,
    handling,
    isPlayer,
  });

  // Car dimensions
  const carWidth = 40;
  const carHeight = 70;
  
  return (
    <div
      className={`absolute ${isPlayer ? 'z-10' : 'z-0'}`}
      style={{
        width: `${carWidth}px`,
        height: `${carHeight}px`,
        transform: `translate(${position.x - carWidth/2}px, ${position.y - carHeight/2}px) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        transition: 'transform 0.05s linear',
      }}
    >
      {/* Car SVG rendering */}
      <svg 
        width={carWidth} 
        height={carHeight} 
        viewBox="0 0 40 70" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Car graphics here */}
        <path 
          d="M10 60 L10 30 C10 20 15 15 20 15 C25 15 30 20 30 30 L30 60 Z" 
          fill={color} 
          stroke="#000" 
          strokeWidth="1" 
        />
        {/* Additional car elements */}
        {/* Wheels, lights, etc. */}
      </svg>
      
      {/* Car name tag */}
      <div className="absolute -bottom-6 left-0 right-0 text-center text-xs">
        {name} {isPlayer && '(You)'}
        {isPlayer && <div>Speed: {Math.round(velocity * 10) / 10}</div>}
      </div>
    </div>
  );
};

export default Car;