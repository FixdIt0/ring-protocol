import { describe, it, expect } from "vitest";
import { calcBullPoints, calcShares } from "./scoring";
import type { Bull } from "./types";

const bull = (overrides: Partial<Bull> = {}): Bull => ({
  xHandle: "a", xId: "1", followers: 0, points: 0, backedAt: 0, tokenId: "t", ...overrides,
});

describe("calcBullPoints", () => {
  it("base 1 point for 0 followers", () => {
    expect(calcBullPoints(0, 0, 10)).toBe(2); // (1+0)*2x early
  });
  it("0 followers, late position = 1 point", () => {
    expect(calcBullPoints(0, 9, 10)).toBe(1); // (1+0)*1x late
  });
  it("10k followers mid position", () => {
    // bonus = min(10000/1000, 50) = 10, quartile 2 = 1x
    expect(calcBullPoints(10_000, 5, 10)).toBe(11);
  });
  it("50k followers = max bonus", () => {
    const pts = calcBullPoints(50_000, 5, 10);
    expect(pts).toBe(51); // (1+50)*1x
  });
  it("100k followers = same as 50k (capped)", () => {
    expect(calcBullPoints(100_000, 5, 10)).toBe(calcBullPoints(50_000, 5, 10));
  });
  it("1M followers = same as 50k (capped)", () => {
    expect(calcBullPoints(1_000_000, 5, 10)).toBe(calcBullPoints(50_000, 5, 10));
  });
  it("first quartile gets 2x", () => {
    expect(calcBullPoints(0, 0, 20)).toBe(2); // position 0/20 = quartile 0 = 2x
  });
  it("second quartile gets 1.5x", () => {
    expect(calcBullPoints(0, 6, 20)).toBe(1.5); // position 6/20 = quartile 1 = 1.5x
  });
  it("third quartile gets 1x", () => {
    expect(calcBullPoints(0, 12, 20)).toBe(1); // position 12/20 = quartile 2 = 1x
  });
  it("fourth quartile gets 1x", () => {
    expect(calcBullPoints(0, 18, 20)).toBe(1); // position 18/20 = quartile 3 = 1x
  });
  it("single bull total = early bonus", () => {
    expect(calcBullPoints(0, 0, 1)).toBe(2); // position 0, total 1: quartile 0 → 2x → (1+0)*2 = 2
  });
  it("handles totalBulls = 0 gracefully", () => {
    expect(calcBullPoints(0, 0, 0)).toBe(2); // quartile = 0 → 2x
  });
  it("500 followers = 0.5 bonus", () => {
    expect(calcBullPoints(500, 5, 10)).toBe(1.5); // (1+0.5)*1x
  });
  it("exact 50k cap boundary", () => {
    expect(calcBullPoints(50_000, 5, 10)).toBe(51); // (1+50)*1x
    expect(calcBullPoints(50_001, 5, 10)).toBe(51); // still capped
  });
});

describe("calcShares", () => {
  it("splits proportionally", () => {
    const shares = calcShares([bull({ xHandle: "a", points: 10 }), bull({ xHandle: "b", points: 30 })], 100);
    expect(shares.get("a")).toBe(25);
    expect(shares.get("b")).toBe(75);
  });
  it("single bull gets full pool", () => {
    const shares = calcShares([bull({ xHandle: "a", points: 5 })], 50);
    expect(shares.get("a")).toBe(50);
  });
  it("empty bulls = empty map", () => {
    expect(calcShares([], 100).size).toBe(0);
  });
  it("zero points = empty map", () => {
    expect(calcShares([bull({ points: 0 })], 100).size).toBe(0);
  });
  it("zero pool = zero shares", () => {
    const shares = calcShares([bull({ xHandle: "a", points: 10 })], 0);
    expect(shares.get("a")).toBe(0);
  });
  it("equal points = equal shares", () => {
    const shares = calcShares([
      bull({ xHandle: "a", points: 10 }),
      bull({ xHandle: "b", points: 10 }),
      bull({ xHandle: "c", points: 10 }),
    ], 90);
    expect(shares.get("a")).toBe(30);
    expect(shares.get("b")).toBe(30);
    expect(shares.get("c")).toBe(30);
  });
  it("handles many bulls", () => {
    const bulls = Array.from({ length: 100 }, (_, i) => bull({ xHandle: `u${i}`, points: 1 }));
    const shares = calcShares(bulls, 100);
    expect(shares.size).toBe(100);
    for (const [, v] of shares) expect(v).toBeCloseTo(1, 5);
  });
  it("fractional points work", () => {
    const shares = calcShares([bull({ xHandle: "a", points: 1.5 }), bull({ xHandle: "b", points: 0.5 })], 100);
    expect(shares.get("a")).toBe(75);
    expect(shares.get("b")).toBe(25);
  });
});
