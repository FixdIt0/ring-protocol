import { describe, it, expect, beforeEach } from "vitest";
import { RingBot } from "./bot";
import { store } from "./store";
import { RingTwitterClient } from "./twitter";
import type { Token, RingMatch } from "./types";

beforeEach(() => {
  store.tokens.clear();
  store.bulls.length = 0;
  store.matches.clear();
  store.claims.length = 0;
  store.lastMentionId = null;
  store.stats = { totalVaults: 0, tokensLaunched: 0, ringMatches: 0, feesClaimed: 0 };
});

function makeDryBot() {
  return new RingBot(new RingTwitterClient({ dryRun: true }));
}

function makeToken(overrides: Partial<Token> = {}): Token {
  return {
    id: `tok_${Date.now()}`, ticker: "TEST", name: "Test", mint: null, imageUrl: null,
    launchMode: "standard", split: { launcher: 40, target: 30, bulls: 25, protocol: 5 },
    launcherXHandle: "user1", launcherXId: "u1", targetXHandle: "target1", targetXId: "t1",
    tweetId: "tw1", conversationId: "conv1", vaultAddress: "v1", vaultBalance: 0,
    status: "bonding", matchId: null, createdAt: Date.now(), ...overrides,
  };
}

// ── Graduation ──
describe("RingBot.handleGraduation", () => {
  it("marks token as graduated", async () => {
    const bot = makeDryBot();
    store.addToken(makeToken({ id: "tok1" }));
    await bot.handleGraduation("tok1");
    expect(store.tokens.get("tok1")!.status).toBe("graduated");
  });

  it("does nothing for unknown token", async () => {
    await makeDryBot().handleGraduation("nonexistent");
    expect(store.tokens.size).toBe(0);
  });

  it("resolves PvP match — winner takes all", async () => {
    const bot = makeDryBot();
    const now = Date.now();
    store.addToken(makeToken({ id: "tokA", ticker: "BULL", launchMode: "pvp", matchId: "m1", createdAt: now }));
    store.addToken(makeToken({ id: "tokB", ticker: "BEAR", launchMode: "pvp", matchId: "m1", createdAt: now }));
    store.addMatch({
      id: "m1", tokenAId: "tokA", tokenBId: "tokB", combinedPot: 8,
      winnerId: null, status: "live", createdAt: now, expiresAt: now + 86400000,
    });

    await bot.handleGraduation("tokA");

    expect(store.matches.get("m1")!.status).toBe("won");
    expect(store.matches.get("m1")!.winnerId).toBe("tokA");
    expect(store.tokens.get("tokA")!.status).toBe("graduated");
    expect(store.tokens.get("tokB")!.status).toBe("dead");
  });

  it("second token graduating after match resolved does nothing extra", async () => {
    const bot = makeDryBot();
    const now = Date.now();
    store.addToken(makeToken({ id: "tokA", launchMode: "pvp", matchId: "m1", createdAt: now }));
    store.addToken(makeToken({ id: "tokB", launchMode: "pvp", matchId: "m1", createdAt: now, status: "dead" }));
    store.addMatch({
      id: "m1", tokenAId: "tokA", tokenBId: "tokB", combinedPot: 8,
      winnerId: "tokA", status: "won", createdAt: now, expiresAt: now + 86400000,
    });

    await bot.handleGraduation("tokB");
    // tokB was already dead, match already won — should just mark graduated
    expect(store.tokens.get("tokB")!.status).toBe("graduated");
    expect(store.matches.get("m1")!.winnerId).toBe("tokA"); // unchanged
  });

  it("standard token graduation has no match side effects", async () => {
    const bot = makeDryBot();
    store.addToken(makeToken({ id: "tok1", launchMode: "standard" }));
    await bot.handleGraduation("tok1");
    expect(store.tokens.get("tok1")!.status).toBe("graduated");
    expect(store.matches.size).toBe(0);
  });
});

// ── Store: tokens ──
describe("Store — tokens", () => {
  it("addToken increments stats", () => {
    store.addToken(makeToken({ id: "a" }));
    store.addToken(makeToken({ id: "b" }));
    expect(store.stats.tokensLaunched).toBe(2);
    expect(store.stats.totalVaults).toBe(2);
  });

  it("getTokensByConversation filters correctly", () => {
    store.addToken(makeToken({ id: "a", conversationId: "c1" }));
    store.addToken(makeToken({ id: "b", conversationId: "c2" }));
    store.addToken(makeToken({ id: "c", conversationId: "c1" }));
    expect(store.getTokensByConversation("c1")).toHaveLength(2);
    expect(store.getTokensByConversation("c2")).toHaveLength(1);
    expect(store.getTokensByConversation("c3")).toHaveLength(0);
  });

  it("tokens map is keyed by id", () => {
    store.addToken(makeToken({ id: "x" }));
    expect(store.tokens.get("x")).toBeDefined();
    expect(store.tokens.get("y")).toBeUndefined();
  });
});

// ── Store: bulls ──
describe("Store — bulls", () => {
  it("getBullsForToken filters correctly", () => {
    store.addBull({ xHandle: "a", xId: "1", followers: 0, points: 1, backedAt: 0, tokenId: "t1" });
    store.addBull({ xHandle: "b", xId: "2", followers: 0, points: 1, backedAt: 0, tokenId: "t2" });
    store.addBull({ xHandle: "c", xId: "3", followers: 0, points: 1, backedAt: 0, tokenId: "t1" });
    expect(store.getBullsForToken("t1")).toHaveLength(2);
    expect(store.getBullsForToken("t2")).toHaveLength(1);
    expect(store.getBullsForToken("t3")).toHaveLength(0);
  });
});

// ── Store: matches ──
describe("Store — matches", () => {
  it("addMatch increments stats", () => {
    store.addMatch({ id: "m1" } as RingMatch);
    store.addMatch({ id: "m2" } as RingMatch);
    expect(store.stats.ringMatches).toBe(2);
  });

  it("matches map is keyed by id", () => {
    store.addMatch({ id: "m1" } as RingMatch);
    expect(store.matches.get("m1")).toBeDefined();
    expect(store.matches.get("m2")).toBeUndefined();
  });
});

// ── Store: claims ──
describe("Store — claims", () => {
  it("getClaimsForHandle is case insensitive", () => {
    store.addClaim({ id: "c1", tokenId: "t1", xHandle: "UserOne", role: "launcher", amount: 1, walletAddress: null, claimed: false, claimedAt: null });
    expect(store.getClaimsForHandle("userone")).toHaveLength(1);
    expect(store.getClaimsForHandle("USERONE")).toHaveLength(1);
    expect(store.getClaimsForHandle("UserOne")).toHaveLength(1);
  });

  it("returns empty for unknown handle", () => {
    expect(store.getClaimsForHandle("nobody")).toHaveLength(0);
  });

  it("returns multiple claims for same handle", () => {
    store.addClaim({ id: "c1", tokenId: "t1", xHandle: "user", role: "launcher", amount: 1, walletAddress: null, claimed: false, claimedAt: null });
    store.addClaim({ id: "c2", tokenId: "t2", xHandle: "user", role: "bull", amount: 2, walletAddress: null, claimed: false, claimedAt: null });
    expect(store.getClaimsForHandle("user")).toHaveLength(2);
  });
});

// ── Store: vault balance ──
describe("Store — vault balance", () => {
  it("vault balance updates correctly", () => {
    const t = makeToken({ id: "t1", vaultBalance: 0 });
    store.addToken(t);
    t.vaultBalance += 5.5;
    expect(store.tokens.get("t1")!.vaultBalance).toBe(5.5);
    t.vaultBalance += 2.3;
    expect(store.tokens.get("t1")!.vaultBalance).toBeCloseTo(7.8);
  });

  it("match combined pot updates", () => {
    store.addMatch({ id: "m1", combinedPot: 0 } as RingMatch);
    const m = store.matches.get("m1")!;
    m.combinedPot += 3;
    m.combinedPot += 4;
    expect(m.combinedPot).toBe(7);
  });
});

// ── Twitter client dry-run ──
describe("RingTwitterClient dry-run", () => {
  it("getMentions returns empty in dry-run", async () => {
    const client = new RingTwitterClient({ dryRun: true });
    expect(await client.getMentions(null)).toEqual([]);
  });

  it("reply returns dry id", async () => {
    const client = new RingTwitterClient({ dryRun: true });
    const id = await client.reply("test", "123");
    expect(id).toMatch(/^dry_/);
  });

  it("getMe returns dry_run", async () => {
    const client = new RingTwitterClient({ dryRun: true });
    expect(await client.getMe()).toBe("dry_run");
  });

  it("getUserFollowers returns 0 in dry-run", async () => {
    const client = new RingTwitterClient({ dryRun: true });
    expect(await client.getUserFollowers("anyone")).toBe(0);
  });

  it("getParentTweet returns null in dry-run", async () => {
    const client = new RingTwitterClient({ dryRun: true });
    expect(await client.getParentTweet("123")).toBeNull();
  });
});

// ── Types/constants ──
import { DEFAULT_SPLITS, PVP, BULL, PRINTR_FEE } from "./types";

describe("Type constants", () => {
  it("default splits total 100", () => {
    for (const mode of ["standard", "pvp"] as const) {
      const s = DEFAULT_SPLITS[mode];
      expect(s.launcher + s.target + s.bulls + s.protocol).toBe(100);
    }
  });

  it("PVP config has sane defaults", () => {
    expect(PVP.matchWindowMin).toBeGreaterThan(0);
    expect(PVP.bullingWindowMin).toBeGreaterThan(0);
    expect(PVP.loserPayout).toBe(0);
    expect(PVP.matchTimeoutHours).toBeGreaterThan(0);
    expect(PVP.autoBuyOnMigration).toBe(true);
  });

  it("BULL config has sane defaults", () => {
    expect(BULL.followerCap).toBe(50_000);
    expect(BULL.followerDivisor).toBe(1_000);
    expect(BULL.earlyMultipliers).toHaveLength(4);
  });

  it("PRINTR_FEE matches expected values", () => {
    expect(PRINTR_FEE.type).toBe("creator");
    expect(PRINTR_FEE.bondingCurve).toBe(1.0);
    expect(PRINTR_FEE.postGrad.custom).toBe(1.40);
    expect(PRINTR_FEE.postGrad.total).toBe(2.00);
  });
});
