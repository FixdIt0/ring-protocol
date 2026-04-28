import { describe, it, expect } from "vitest";
import { calcBullPoints, calcShares } from "./scoring";
import type { Bull } from "./types";

describe("calcBullPoints", () => {
  it("gives base 1 point for 0 followers", () => {
    const pts = calcBullPoints(0, 0, 10);
    expect(pts).toBeGreaterThanOrEqual(1);
  });

  it("caps follower bonus at 50", () => {
    const pts100k = calcBullPoints(100_000, 5, 10);
    const pts50k = calcBullPoints(50_000, 5, 10);
    expect(pts100k).toBe(pts50k); // both capped
  });

  it("gives early multiplier to first quartile", () => {
    const early = calcBullPoints(10_000, 0, 20);  // position 0 of 20 = first quartile = 2x
    const late = calcBullPoints(10_000, 15, 20);   // position 15 of 20 = last quartile = 1x
    expect(early).toBeGreaterThan(late);
  });

  it("first bull gets 2x multiplier", () => {
    const pts = calcBullPoints(0, 0, 10); // position 0, quartile 0 = 2x
    expect(pts).toBe(2); // (1 + 0) * 2
  });

  it("10k follower account gets correct bonus", () => {
    const pts = calcBullPoints(10_000, 5, 10); // mid position, 10k followers
    // followerBonus = min(10000/1000, 50) = 10
    // quartile = floor(5/10 * 4) = 2, multiplier = 1
    expect(pts).toBe(11); // (1 + 10) * 1
  });
});

describe("calcShares", () => {
  it("splits pool proportionally", () => {
    const bulls: Bull[] = [
      { xHandle: "a", xId: "1", followers: 0, points: 10, backedAt: 0, tokenId: "t" },
      { xHandle: "b", xId: "2", followers: 0, points: 30, backedAt: 0, tokenId: "t" },
    ];
    const shares = calcShares(bulls, 100);
    expect(shares.get("a")).toBe(25);
    expect(shares.get("b")).toBe(75);
  });

  it("returns empty map for no bulls", () => {
    expect(calcShares([], 100).size).toBe(0);
  });

  it("returns empty map for zero points", () => {
    const bulls: Bull[] = [
      { xHandle: "a", xId: "1", followers: 0, points: 0, backedAt: 0, tokenId: "t" },
    ];
    expect(calcShares(bulls, 100).size).toBe(0);
  });

  it("handles single bull getting full pool", () => {
    const bulls: Bull[] = [
      { xHandle: "a", xId: "1", followers: 0, points: 5, backedAt: 0, tokenId: "t" },
    ];
    const shares = calcShares(bulls, 50);
    expect(shares.get("a")).toBe(50);
  });
});
