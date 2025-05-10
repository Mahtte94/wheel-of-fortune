import React from "react";

type WheelSegment = {
  label: string | number;
  color: string;
};

type WheelProps = {
  segments: WheelSegment[];
  spinningAngle: number;
};

const Wheel = ({ segments, spinningAngle }: WheelProps) => {
  const radius = 250;
  const center = radius;
  const anglePerSegment = 360 / segments.length;

  return (
    <div className="relative w-[500px] h-[500px] mx-auto z-1">
      <svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className="transition-transform duration-[4s] ease-out"
        style={{ transform: `rotate(${spinningAngle}deg)` }}
      >
        {segments.map((seg, i) => {
          const start = i * anglePerSegment;
          const end = start + anglePerSegment;

          const rad = (deg: number) => (Math.PI * deg) / 180;
          const x1 = center + radius * Math.cos(rad(start));
          const y1 = center + radius * Math.sin(rad(start));
          const x2 = center + radius * Math.cos(rad(end));
          const y2 = center + radius * Math.sin(rad(end));

          const labelAngle = start + anglePerSegment / 2;
          const lx = center + (radius / 1.7) * Math.cos(rad(labelAngle)); 
          const ly = center + (radius / 1.7) * Math.sin(rad(labelAngle));

          return (
            <g key={i}>
              <path
                d={`M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${
                  anglePerSegment > 180 ? 1 : 0
                },1 ${x2},${y2} Z`}
                fill={seg.color}
                stroke="#fff"
                strokeWidth="2"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="24" 
                fill="#000" 
                transform={`rotate(${labelAngle + 90}, ${lx}, ${ly})`}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {seg.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Pointer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[240px] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-red-600 z-10" />
    </div>
  );
};

export default Wheel;