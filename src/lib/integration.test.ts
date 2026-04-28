import { describe, it, expect } from "vitest";

describe("Printr module", () => {
  it("launchToken returns error without wallet", async () => {
    const { launchToken } = await import("./printr");
    const result = await launchToken({
      name: "Test", ticker: "TST", creatorWallet: "",
    });
    // Without a real wallet/API, should return an error or empty result
    expect(result).toBeDefined();
    expect(typeof result.error === "string" || result.tokenId === "").toBe(true);
  });

  it("getToken returns null for nonexistent", async () => {
    const { getToken } = await import("./printr");
    const result = await getToken("nonexistent_id_12345");
    expect(result).toBeNull();
  });

  it("printrClient is exported", async () => {
    const { printrClient } = await import("./printr");
    expect(printrClient).toBeDefined();
  });
});

describe("DB module — no DATABASE_URL", () => {
  it("initDb warns without DATABASE_URL", async () => {
    const { initDb } = await import("./db");
    // Should not throw, just warn
    await expect(initDb()).resolves.toBeUndefined();
  });

  it("dbGetTokens returns empty without DB", async () => {
    const { dbGetTokens } = await import("./db");
    expect(await dbGetTokens()).toEqual([]);
  });

  it("dbGetBullsForToken returns empty without DB", async () => {
    const { dbGetBullsForToken } = await import("./db");
    expect(await dbGetBullsForToken("any")).toEqual([]);
  });

  it("dbGetClaimsForHandle returns empty without DB", async () => {
    const { dbGetClaimsForHandle } = await import("./db");
    expect(await dbGetClaimsForHandle("any")).toEqual([]);
  });

  it("dbGetKv returns null without DB", async () => {
    const { dbGetKv } = await import("./db");
    expect(await dbGetKv("any")).toBeNull();
  });

  it("dbAddToken does not throw without DB", async () => {
    const { dbAddToken } = await import("./db");
    await expect(dbAddToken({
      id: "t1", ticker: "T", name: "Test", mint: null, imageUrl: null,
      launchMode: "standard", split: { launcher: 40, target: 30, bulls: 25, protocol: 5 },
      launcherXHandle: "u", launcherXId: "u1", targetXHandle: "t", targetXId: null,
      tweetId: "tw", conversationId: "c", vaultAddress: "v", vaultBalance: 0,
      status: "bonding", matchId: null, createdAt: Date.now(),
    })).resolves.toBeUndefined();
  });

  it("pool is null without DATABASE_URL", async () => {
    const { pool } = await import("./db");
    expect(pool).toBeNull();
  });
});
