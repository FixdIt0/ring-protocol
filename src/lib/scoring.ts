import { BACKER } from "./types";
import type { Backer } from "./types";

export function calcBackerPoints(followers: number, position: number, totalBackers: number): number {
  const base = 1;
  const followerBonus = Math.min(followers / BACKER.followerDivisor, BACKER.followerCap / BACKER.followerDivisor);
  const quartile = totalBackers > 0 ? Math.floor((position / totalBackers) * 4) : 0;
  const earlyMult = BACKER.earlyMultipliers[Math.min(quartile, 3)]!;
  return (base + followerBonus) * earlyMult;
}

export function calcShares(backers: Backer[], poolSol: number): Map<string, number> {
  const shares = new Map<string, number>();
  const totalPoints = backers.reduce((s, b) => s + b.points, 0);
  if (totalPoints === 0) return shares;
  for (const b of backers) {
    shares.set(b.xHandle, (b.points / totalPoints) * poolSol);
  }
  return shares;
}
