import { BULL } from "./types";
import type { Bull } from "./types";

export function calcBullPoints(followers: number, position: number, totalBulls: number): number {
  const base = 1;
  const followerBonus = Math.min(followers / BULL.followerDivisor, BULL.followerCap / BULL.followerDivisor);
  const quartile = totalBulls > 0 ? Math.floor((position / totalBulls) * 4) : 0;
  const earlyMult = BULL.earlyMultipliers[Math.min(quartile, 3)]!;
  return (base + followerBonus) * earlyMult;
}

export function calcShares(bulls: Bull[], poolSol: number): Map<string, number> {
  const shares = new Map<string, number>();
  const totalPoints = bulls.reduce((s, b) => s + b.points, 0);
  if (totalPoints === 0) return shares;
  for (const b of bulls) shares.set(b.xHandle, (b.points / totalPoints) * poolSol);
  return shares;
}
