import { describe, it, expect, beforeEach } from "vitest";
import { RingBot } from "./bot";
import { store } from "./store";
import { RingTwitterClient } from "./twitter";

// Reset store between tests
beforeEach(() => {
  store.tokens.clear();
  store.bulls.length = 0;
  store.matches.clear();
  store.claims.length = 0;
  store.lastMentionId = null;
  store.stats = { totalVaults: 0, tokensLaunched: 0, ringMatches: 0, feesClaimed: 0 };
});

function makeDryBot() {
  const twitter = new RingTwitterClient({ dryRun: true });
  return new RingBot(twitter);
}

describe("RingBot.handleGraduation", () => {
  it("marks token as graduated", async () => {
    const bot = makeDryBot();
    store.addToken({
      id: "tok1", ticker: "TEST", name: "Test", mint: null, imageUrl: null,
      launchMode: "standard", split: { launcher: 40, target: 30, bulls: 25, protocol: 5 },
      launcherXHandle: "user1", launcherXId: "u1",
      targetXHandle: "target1", targetXId: "t1",
      tweetId: "tw1", conversationId: "conv1",
      vaultAddress: "v1", vaultBalance: 10, status: "bonding", matchId: null, createdAt: Date.now(),
    });

    await bot.handleGraduation("tok1");
    expect(store.tokens.get("tok1")!.status).toBe("graduated");
  });

  it("resolves PvP match on graduation — winner takes all", async () => {
    const bot = makeDryBot();
    const now = Date.now();

    store.addToken({
      id: "tokA", ticker: "BULL", name: "Bull", mint: null, imageUrl: null,
      launchMode: "pvp", split: { launcher: 40, target: 30, bulls: 25, protocol: 5 },
      launcherXHandle: "userA", launcherXId: "uA",
      targetXHandle: "target", targetXId: "t",
      tweetId: "twA", conversationId: "conv1",
      vaultAddress: "vA", vaultBalance: 5, status: "bonding", matchId: "match1", createdAt: now,
    });

    store.addToken({
      id: "tokB", ticker: "BEAR", name: "Bear", mint: null, imageUrl: null,
      launchMode: "pvp", split: { launcher: 40, target: 30, bulls: 25, protocol: 5 },
      launcherXHandle: "userB", launcherXId: "uB",
      targetXHandle: "target", targetXId: "t",
      tweetId: "twB", conversationId: "conv1",
      vaultAddress: "vB", vaultBalance: 3, status: "bonding", matchId: "match1", createdAt: now,
    });

    store.addMatch({
      id: "match1", tokenAId: "tokA", tokenBId: "tokB",
      combinedPot: 8, winnerId: null, status: "live",
      createdAt: now, expiresAt: now + 86400000,
    });

    // tokA graduates first
    await bot.handleGraduation("tokA");

    const match = store.matches.get("match1")!;
    expect(match.status).toBe("won");
    expect(match.winnerId).toBe("tokA");
    expect(store.tokens.get("tokA")!.status).toBe("graduated");
    expect(store.tokens.get("tokB")!.status).toBe("dead");
  });

  it("does nothing for unknown token", async () => {
    const bot = makeDryBot();
    await bot.handleGraduation("nonexistent"); // should not throw
  });

  it("standard token graduation has no match side effects", async () => {
    const bot = makeDryBot();
    store.addToken({
      id: "tok1", ticker: "STD", name: "Standard", mint: null, imageUrl: null,
      launchMode: "standard", split: { launcher: 40, target: 30, bulls: 25, protocol: 5 },
      launcherXHandle: "user1", launcherXId: "u1",
      targetXHandle: "target1", targetXId: "t1",
      tweetId: "tw1", conversationId: "conv1",
      vaultAddress: "v1", vaultBalance: 10, status: "bonding", matchId: null, createdAt: Date.now(),
    });

    await bot.handleGraduation("tok1");
    expect(store.tokens.get("tok1")!.status).toBe("graduated");
    expect(store.matches.size).toBe(0);
  });
});

describe("Store operations", () => {
  it("getTokensByConversation filters correctly", () => {
    store.addToken({ id: "a", conversationId: "c1", ticker: "A" } as any);
    store.addToken({ id: "b", conversationId: "c2", ticker: "B" } as any);
    store.addToken({ id: "c", conversationId: "c1", ticker: "C" } as any);
    expect(store.getTokensByConversation("c1").length).toBe(2);
    expect(store.getTokensByConversation("c2").length).toBe(1);
  });

  it("getBullsForToken filters correctly", () => {
    store.addBull({ xHandle: "a", xId: "1", followers: 0, points: 1, backedAt: 0, tokenId: "t1" });
    store.addBull({ xHandle: "b", xId: "2", followers: 0, points: 1, backedAt: 0, tokenId: "t2" });
    store.addBull({ xHandle: "c", xId: "3", followers: 0, points: 1, backedAt: 0, tokenId: "t1" });
    expect(store.getBullsForToken("t1").length).toBe(2);
    expect(store.getBullsForToken("t2").length).toBe(1);
  });

  it("getClaimsForHandle is case insensitive", () => {
    store.addClaim({ id: "c1", tokenId: "t1", xHandle: "UserOne", role: "launcher", amount: 1, walletAddress: null, claimed: false, claimedAt: null });
    expect(store.getClaimsForHandle("userone").length).toBe(1);
    expect(store.getClaimsForHandle("USERONE").length).toBe(1);
  });

  it("stats increment on addToken and addMatch", () => {
    store.addToken({ id: "t1" } as any);
    store.addToken({ id: "t2" } as any);
    expect(store.stats.tokensLaunched).toBe(2);
    store.addMatch({ id: "m1" } as any);
    expect(store.stats.ringMatches).toBe(1);
  });
});
