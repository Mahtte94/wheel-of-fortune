export const segmentsData = [
  { label: "JACKPOT", color: "#ffd700" }, // 1
  { label: "TRY AGAIN", color: "#ff6b6b" }, // 2
  { label: "WIN", color: "#00ff7f" }, // 3
  { label: "TRY AGAIN", color: "#ff6b6b" }, // 4
  { label: "FREE SPIN", color: "#66ccff" }, // 5
  { label: "TRY AGAIN", color: "#ff6b6b" }, // 6
  { label: "JACKPOT", color: "#ffd700" }, // 7
  { label: "TRY AGAIN", color: "#ff6b6b" }, // 8
  { label: "WIN", color: "#00ff7f" }, // 9
  { label: "TRY AGAIN", color: "#ff6b6b" }, // 10
  { label: "TRY AGAIN", color: "#ff6b6b" }, // 11
  { label: "TRY AGAIN", color: "#ff6b6b" }, // 12
];

export const STARTING_MONEY = 100;
export const SPIN_COST = 10;
export const WIN_MULTIPLIER = 5; // for JACKPOT

export type WheelSegment = {
  label: string | number;
  color: string;
};
