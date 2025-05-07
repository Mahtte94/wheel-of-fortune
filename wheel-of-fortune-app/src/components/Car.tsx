import React, { useState, useEffect } from 'react';

// Define the properties for a car
export interface CarProps {
  id: number;
  name: string;
  color: string;
  speed: number;
  acceleration: number;
  handling: number;
  position: { x: number; y: number };
  rotation: number;
  isPlayer?: boolean;
}

// Define the Car component
const Car: React.FC<CarProps> = ({
  id,
  name,
  color,
  speed,
  acceleration,
  handling,
  position,
  rotation,
  isPlayer = false,
}) => {
  // State for car position and movement
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const [velocity, setVelocity] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isTurningLeft, setIsTurningLeft] = useState(false);
  const [isTurningRight, setIsTurningRight] = useState(false);

  // Car dimensions
  const carWidth = 40;
  const carHeight = 70;

  // Physics constants
  const FRICTION = 0.98;
  const MAX_SPEED = speed;
  const ACCELERATION_FACTOR = acceleration * 0.01;
  const ROTATION_SPEED = handling * 0.5;

  // Effect for handling keyboard input (for player's car only)
  useEffect(() => {
    if (!isPlayer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setIsAccelerating(true);
          break;
        case 'ArrowLeft':
          setIsTurningLeft(true);
          break;
        case 'ArrowRight':
          setIsTurningRight(true);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setIsAccelerating(false);
          break;
        case 'ArrowLeft':
          setIsTurningLeft(false);
          break;
        case 'ArrowRight':
          setIsTurningRight(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlayer]);

  // Effect for car physics
  useEffect(() => {
    const updatePhysics = () => {
      // Update velocity
      let newVelocity = velocity;
      if (isAccelerating) {
        newVelocity += ACCELERATION_FACTOR;
        if (newVelocity > MAX_SPEED) {
          newVelocity = MAX_SPEED;
        }
      } else {
        newVelocity *= FRICTION;
      }

      // Update rotation when moving
      let newRotation = currentRotation;
      if (newVelocity > 0.1) {
        if (isTurningLeft) {
          newRotation -= ROTATION_SPEED * (newVelocity / MAX_SPEED);
        }
        if (isTurningRight) {
          newRotation += ROTATION_SPEED * (newVelocity / MAX_SPEED);
        }
      }

      // Update position based on velocity and rotation
      const radians = (newRotation * Math.PI) / 180;
      const newPosition = {
        x: currentPosition.x + Math.sin(radians) * newVelocity,
        y: currentPosition.y - Math.cos(radians) * newVelocity,
      };

      // Update state
      setVelocity(newVelocity);
      setCurrentRotation(newRotation);
      setCurrentPosition(newPosition);
    };

    // Run physics update at 60fps
    const intervalId = setInterval(updatePhysics, 16);
    return () => clearInterval(intervalId);
  }, [velocity, currentPosition, currentRotation, isAccelerating, isTurningLeft, isTurningRight, MAX_SPEED, ACCELERATION_FACTOR, ROTATION_SPEED]);

  return (
    <div
      className={`absolute ${isPlayer ? 'z-10' : 'z-0'}`}
      style={{
        width: `${carWidth}px`,
        height: `${carHeight}px`,
        transform: `translate(${currentPosition.x - carWidth/2}px, ${currentPosition.y - carHeight/2}px) rotate(${currentRotation}deg)`,
        transformOrigin: 'center center',
        transition: 'transform 0.05s linear',
      }}
    >
      {/* Car Body SVG */}
      <svg 
        width={carWidth} 
        height={carHeight} 
        viewBox="0 0 40 70" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Car Shadow */}
        <ellipse 
          cx="20" 
          cy="65" 
          rx="18" 
          ry="4" 
          fill="rgba(0,0,0,0.3)" 
        />
        
        {/* Main Car Body */}
        <path 
          d="M10 60 L10 30 C10 20 15 15 20 15 C25 15 30 20 30 30 L30 60 Z" 
          fill={color} 
          stroke="#000" 
          strokeWidth="1" 
        />
        
        {/* Car Roof */}
        <path 
          d="M12 32 C12 24 16 20 20 20 C24 20 28 24 28 32 L28 36 L12 36 Z" 
          fill={color} 
          stroke="#000" 
          strokeWidth="1" 
        />
        
        {/* Windshield */}
        <path 
          d="M14 31 C14 25 16 22 20 22 C24 22 26 25 26 31 L26 34 L14 34 Z" 
          fill="#a0c8ff" 
          stroke="#000" 
          strokeWidth="0.5" 
        />
        
        {/* Wheels */}
        <circle cx="8" cy="38" r="5" fill="#333333" />
        <circle cx="8" cy="38" r="3" fill="#dddddd" />
        
        <circle cx="32" cy="38" r="5" fill="#333333" />
        <circle cx="32" cy="38" r="3" fill="#dddddd" />
        
        <circle cx="8" cy="58" r="5" fill="#333333" />
        <circle cx="8" cy="58" r="3" fill="#dddddd" />
        
        <circle cx="32" cy="58" r="5" fill="#333333" />
        <circle cx="32" cy="58" r="3" fill="#dddddd" />
        
        {/* Front Lights */}
        <circle cx="13" cy="18" r="2" fill={isPlayer ? "#ffff00" : "#ffffff"} />
        <circle cx="27" cy="18" r="2" fill={isPlayer ? "#ffff00" : "#ffffff"} />
        
        {/* Rear Lights */}
        <rect x="12" y="62" width="4" height="2" rx="1" fill="#ff0000" />
        <rect x="24" y="62" width="4" height="2" rx="1" fill="#ff0000" />
        
        {/* Car Details */}
        <rect x="18" y="40" width="4" height="10" rx="1" fill="#222" />
        
        {/* Player Indicator (Only for player's car) */}
        {isPlayer && (
          <g>
            <circle cx="20" cy="10" r="4" fill="#ffcc00" />
            <text x="20" y="12" textAnchor="middle" fill="#000" fontSize="5" fontWeight="bold">P</text>
          </g>
        )}
      </svg>
      
      {/* Car name tag */}
      <div 
        className={`absolute -bottom-6 left-0 right-0 text-center font-bold text-xs ${isPlayer ? 'text-yellow-300' : 'text-white'} px-1 rounded`}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          textShadow: '0px 0px 2px #000',
          whiteSpace: 'nowrap',
        }}
      >
        {name} {isPlayer && '(You)'}
        {isPlayer && (
          <div className="text-xs font-normal">
            Speed: {Math.round(velocity * 10) / 10}
          </div>
        )}
      </div>
    </div>
  );
};

export default Car;