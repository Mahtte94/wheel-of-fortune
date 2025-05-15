export const SPIN_COST = 10;
export const STARTING_MONEY = 100;
export const WIN_MULTIPLIER = 5;

export const segmentsData = [
  { label: 1, color: "#ff6b6b" }, // bright red
  { label: 2, color: "#ff8c00" }, // vivid orange
  { label: 3, color: "#ffd700" }, // gold
  { label: 4, color: "#adff2f" }, // lime-yellow
  { label: 5, color: "#00ff7f" }, // spring green
  { label: 6, color: "#40e0d0" }, // turquoise
  { label: 7, color: "#00ced1" }, // strong cyan
  { label: 8, color: "#66ccff" }, // light sky-blue
  { label: 9, color: "#3399ff" }, // bright blue
  { label: 10, color: "#d279ff" }, // soft violet
  { label: 11, color: "#ff66b2" }, // hot pink
  { label: 12, color: "#ff00ff" }, // magenta
];

export type WheelSegment = {
  label: string | number;
  color: string;
};
