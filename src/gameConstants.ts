export const SPIN_COST = 10;
export const STARTING_MONEY = 100;
export const WIN_MULTIPLIER = 5;

export const segmentsData = [
  { label: 1, color: "#f87171" },
  { label: 2, color: "#fbbf24" },
  { label: 3, color: "#34d399" },
  { label: 4, color: "#60a5fa" },
  { label: 5, color: "#a78bfa" },
  { label: 6, color: "#f472b6" },
];

export type WheelSegment = {
  label: string | number;
  color: string;
};