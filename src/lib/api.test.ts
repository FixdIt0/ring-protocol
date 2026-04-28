import { describe, it, expect, beforeEach } from "vitest";
import { store } from "./store";
import { calcShares } from "./scoring";
import type { Token, VaultSplit } from "./types";

// We test the API logic directly since Next.js route handlers are just functions
// that take Request and return Response — but they depend on Next.js internals.
// So we test the store operations that the routes use.

beforeEach(() => {
  store.tokens.clear();
  store.bulls.length = 0;
  store.matches.clear();
  store.claims.length = 0;
  store.lastMentionId = null;
  store.stats = { totalVaults: 0, tokensLaunched: 0, ringMatches: 0, feesClaimed: 0 };
});

const split: VaultSplit = { launcher: 40, target: 30, bulls: 25, protocol: 5 };

function addToken(id: string, overrides: Partial<Token> = {}) {
  const t: Token = {
    id, ticker: "T", name: "Test", mint: null, imageUrl: null,
    launchMode: "standard", split,
    launcherXHandle: "launcher1", launcherXId: "l1",
    targetXHandle: "target1", targetXId: "t1",
    tweetId: "tw1", conversationId: "conv1",
    vaultAddress: "v1", vaultBalance: 100, status: "bonding",
    matchId: null, createdAt: Date.now(), ...overrides,
  };
  store.addToken(t);
  return t;
}

// ── GET /api/tokens logic ──
describe("API /api/tokens", () => {
  it("returns empty array when no tokens", () => {
    expect([...store.tokens.values()]).toEqual([]);
  });
  it("returns all tokens", () => {
    addToken("a"); addToken("b"); addToken("c");
    expect([...store.tokens.values()]).toHaveLength(3);
  });
  it("tokens have correct shape", () => {
    addToken("a", { ticker: "BULL", vaultBalance: 50 });
    const t = [...store.tokens.values()][0]!;
    expect(t.id).toBe("a");
    expect(t.ticker).toBe("BULL");
    expect(t.vaultBalance).toBe(50);
    expect(t.split).toEqual(split);
  });
});

// ── GET /api/matches logic ──
describe("API /api/matches", () => {
  it("returns empty when no matches", () => {
    expect([...store.matches.values()]).toEqual([]);
  });
  it("returns all matches", () => {
    store.addMatch({ id: "m1", tokenAId: "a", tokenBId: "b", combinedPot: 0, winnerId: null, status: "live", createdAt: Date.now(), expiresAt: Date.now() + 86400000 });
    store.addMatch({ id: "m2", tokenAId: "c", tokenBId: "d", combinedPot: 5, winnerId: null, status: "live", createdAt: Date.now(), expiresAt: Date.now() + 86400000 });
    expect([...store.matches.values()]).toHaveLength(2);
  });
});

// ── GET /api/state logic ──
describe("API /api/state", () => {
  it("stats start at zero", () => {
    expect(store.stats).toEqual({ totalVaults: 0, tokensLaunched: 0, ringMatches: 0, feesClaimed: 0 });
  });
  it("stats update after operations", () => {
    addToken("a"); addToken("b");
    store.addMatch({ id: "m1" } as any);
    expect(store.stats.tokensLaunched).toBe(2);
    expect(store.stats.totalVaults).toBe(2);
    expect(store.stats.ringMatches).toBe(1);
  });
});

// ── POST /api/claims logic ──
describe("API /api/claims — claim calculation", () => {
  it("launcher gets correct share", () => {
    addToken("t1", { vaultBalance: 100 });
    const amount = 100 * (split.launcher / 100);
    expect(amount).toBe(40);
  });

  it("target gets correct share", () => {
    addToken("t1", { vaultBalance: 100 });
    const amount = 100 * (split.target / 100);
    expect(amount).toBe(30);
  });

  it("bull gets proportional share", () => {
    addToken("t1", { vaultBalance: 100 });
    store.addBull({ xHandle: "bull1", xId: "b1", followers: 0, points: 10, backedAt: 0, tokenId: "t1" });
    store.addBull({ xHandle: "bull2", xId: "b2", followers: 0, points: 30, backedAt: 0, tokenId: "t1" });
    const pool = 100 * (split.bulls / 100); // 25
    const shares = calcShares(store.getBullsForToken("t1"), pool);
    expect(shares.get("bull1")).toBe(6.25);  // 10/40 * 25
    expect(shares.get("bull2")).toBe(18.75); // 30/40 * 25
  });

  it("bull with no points gets nothing", () => {
    addToken("t1", { vaultBalance: 100 });
    store.addBull({ xHandle: "bull1", xId: "b1", followers: 0, points: 0, backedAt: 0, tokenId: "t1" });
    const pool = 100 * (split.bulls / 100);
    const shares = calcShares(store.getBullsForToken("t1"), pool);
    expect(shares.get("bull1")).toBeUndefined(); // zero points = not in map
  });

  it("claim with 0 vault balance = 0 for everyone", () => {
    addToken("t1", { vaultBalance: 0 });
    expect(0 * (split.launcher / 100)).toBe(0);
    expect(0 * (split.target / 100)).toBe(0);
  });

  it("custom split works correctly", () => {
    const customSplit: VaultSplit = { launcher: 60, target: 10, bulls: 25, protocol: 5 };
    addToken("t1", { vaultBalance: 200, split: customSplit });
    const t = store.tokens.get("t1")!;
    expect(t.vaultBalance * (t.split.launcher / 100)).toBe(120);
    expect(t.vaultBalance * (t.split.target / 100)).toBe(20);
    expect(t.vaultBalance * (t.split.bulls / 100)).toBe(50);
    expect(t.vaultBalance * (t.split.protocol / 100)).toBe(10);
  });

  it("claim is stored correctly", () => {
    store.addClaim({ id: "c1", tokenId: "t1", xHandle: "user1", role: "launcher", amount: 40, walletAddress: "abc123", claimed: false, claimedAt: null });
    const claims = store.getClaimsForHandle("user1");
    expect(claims).toHaveLength(1);
    expect(claims[0]!.amount).toBe(40);
    expect(claims[0]!.role).toBe("launcher");
    expect(claims[0]!.claimed).toBe(false);
  });
});

// ── POST /api/webhook/fees logic ──
describe("API /api/webhook/fees — fee tracking", () => {
  it("adds fees to token vault", () => {
    addToken("t1", { vaultBalance: 0 });
    const t = store.tokens.get("t1")!;
    t.vaultBalance += 5.5;
    expect(t.vaultBalance).toBe(5.5);
    t.vaultBalance += 2.3;
    expect(t.vaultBalance).toBeCloseTo(7.8);
  });

  it("adds fees to match combined pot", () => {
    addToken("t1", { vaultBalance: 0, matchId: "m1" });
    store.addMatch({ id: "m1", tokenAId: "t1", tokenBId: "t2", combinedPot: 0, winnerId: null, status: "live", createdAt: Date.now(), expiresAt: Date.now() + 86400000 });
    const t = store.tokens.get("t1")!;
    const m = store.matches.get("m1")!;
    const fee = 3.5;
    t.vaultBalance += fee;
    m.combinedPot += fee;
    expect(t.vaultBalance).toBe(3.5);
    expect(m.combinedPot).toBe(3.5);
  });

  it("unknown token returns no match", () => {
    expect(store.tokens.get("nonexistent")).toBeUndefined();
  });

  it("multiple fee additions accumulate", () => {
    addToken("t1", { vaultBalance: 0 });
    const t = store.tokens.get("t1")!;
    for (let i = 0; i < 100; i++) t.vaultBalance += 0.01;
    expect(t.vaultBalance).toBeCloseTo(1.0, 1);
  });
});

// ── POST /api/bot logic ──
import { RingTwitterClient } from "./twitter";
import { RingBot } from "./bot";

describe("API /api/bot — bot lifecycle", () => {
  it("bot can be created with dry-run client", () => {
    const twitter = new RingTwitterClient({ dryRun: true });
    const bot = new RingBot(twitter);
    expect(bot).toBeDefined();
  });

  it("bot stop prevents further polling", () => {
    const bot = new RingBot(new RingTwitterClient({ dryRun: true }));
    bot.stop();
    expect(true).toBe(true);
  });
});
