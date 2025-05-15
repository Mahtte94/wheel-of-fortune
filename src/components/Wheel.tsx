type WheelSegment = {
  label: string | number;
  color: string;
};

type WheelProps = {
  segments: WheelSegment[];
  spinningAngle: number;
};

const Wheel = ({ segments, spinningAngle }: WheelProps) => {
  const baseRadius = 250;
  const center = baseRadius;
  const anglePerSegment = 360 / segments.length;

  return (
    <div className="relative w-full max-w-[600px] mx-auto mb-8">
      {/* Pointer Container - positioned at the top */}
      <div className="absolute top-9 left-1/2 -translate-x-1/2 z-20">
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-red-600 rotate-180" />
      </div>

      {/* Wheel container */}
      <div className="pt-10">
        {" "}
        {/* Add padding top to make room for the pointer */}
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${baseRadius * 2} ${baseRadius * 2}`}
          preserveAspectRatio="xMidYMid meet"
          className="transition-transform duration-[4s] ease-out"
          style={{ transform: `rotate(${spinningAngle}deg)` }}
        >
          {segments.map((seg, i) => {
            const start = i * anglePerSegment;
            const end = start + anglePerSegment;

            const rad = (deg: number) => (Math.PI * deg) / 180;
            const x1 = center + baseRadius * Math.cos(rad(start));
            const y1 = center + baseRadius * Math.sin(rad(start));
            const x2 = center + baseRadius * Math.cos(rad(end));
            const y2 = center + baseRadius * Math.sin(rad(end));

            const labelAngle = start + anglePerSegment / 2;
            const lx = center + (baseRadius / 1.7) * Math.cos(rad(labelAngle));
            const ly = center + (baseRadius / 1.7) * Math.sin(rad(labelAngle));

            return (
              <g key={i}>
                <path
                  d={`M${center},${center} L${x1},${y1} A${baseRadius},${baseRadius} 0 ${
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
                  fontWeight="bold"
                  transform={`rotate(${labelAngle + 90}, ${lx}, ${ly})`}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {seg.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Wheel;
