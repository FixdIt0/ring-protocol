import { describe, it, expect } from "vitest";
import { RingTwitterClient } from "./twitter";

describe("RingTwitterClient — construction", () => {
  it("creates in dry-run when dryRun=true", () => {
    const c = new RingTwitterClient({ dryRun: true });
    expect(c).toBeDefined();
  });

  it("creates in dry-run when no apiKey", () => {
    const c = new RingTwitterClient({});
    expect(c).toBeDefined();
  });

  it("creates in dry-run when apiKey is undefined", () => {
    const c = new RingTwitterClient({ apiKey: undefined });
    expect(c).toBeDefined();
  });

  it("creates in dry-run when apiKey is empty string", () => {
    const c = new RingTwitterClient({ apiKey: "" });
    expect(c).toBeDefined();
  });
});

describe("RingTwitterClient — dry-run getMe", () => {
  it("returns dry_run", async () => {
    const c = new RingTwitterClient({ dryRun: true });
    expect(await c.getMe()).toBe("dry_run");
  });

  it("caches result on second call", async () => {
    const c = new RingTwitterClient({ dryRun: true });
    const a = await c.getMe();
    const b = await c.getMe();
    expect(a).toBe(b);
  });
});

describe("RingTwitterClient — dry-run reply", () => {
  it("returns a dry_ prefixed id", async () => {
    const c = new RingTwitterClient({ dryRun: true });
    const id = await c.reply("hello", "123");
    expect(id).toMatch(/^dry_\d+$/);
  });

  it("returns different ids for different calls", async () => {
    const c = new RingTwitterClient({ dryRun: true });
    const a = await c.reply("a", "1");
    // tiny delay to ensure different timestamp
    await new Promise(r => setTimeout(r, 2));
    const b = await c.reply("b", "2");
    expect(a).not.toBe(b);
  });

  it("handles empty text", async () => {
    const c = new RingTwitterClient({ dryRun: true });
    const id = await c.reply("", "123");
    expect(id).toMatch(/^dry_/);
  });

  it("handles very long text", async () => {
    const c = new RingTwitterClient({ dryRun: true });
    const id = await c.reply("x".repeat(10000), "123");
    expect(id).toMatch(/^dry_/);
  });
});

describe("RingTwitterClient — dry-run getMentions", () => {
  it("returns empty array", async () => {
    const c = new RingTwitterClient({ dryRun: true });
    expect(await c.getMentions(null)).toEqual([]);
  });

  it("returns empty with sinceId", async () => {
    const c = new RingTwitterClient({ dryRun: true });
    expect(await c.getMentions("12345")).toEqual([]);
  });
});

describe("RingTwitterClient — dry-run getUserFollowers", () => {
  it("returns 0 for any username", async () => {
    const c = new RingTwitterClient({ dryRun: true });
    expect(await c.getUserFollowers("elonmusk")).toBe(0);
  });

  it("returns 0 for empty string", async () => {
    const c = new RingTwitterClient({ dryRun: true });
    expect(await c.getUserFollowers("")).toBe(0);
  });
});

describe("RingTwitterClient — dry-run getParentTweet", () => {
  it("returns null for any id", async () => {
    const c = new RingTwitterClient({ dryRun: true });
    expect(await c.getParentTweet("123")).toBeNull();
  });

  it("returns null for empty id", async () => {
    const c = new RingTwitterClient({ dryRun: true });
    expect(await c.getParentTweet("")).toBeNull();
  });
});

describe("RingTwitterClient — live mode without creds throws", () => {
  it("throws when apiKey provided but missing other creds", () => {
    // TwitterApi constructor will throw if partial creds
    expect(() => {
      new RingTwitterClient({
        apiKey: "key",
        apiSecret: undefined,
        accessToken: undefined,
        accessSecret: undefined,
      });
    }).toThrow();
  });
});

describe("RingTwitterClient — Mention type shape", () => {
  it("Mention interface has correct fields", () => {
    // Type-level test — if this compiles, the interface is correct
    const mention: import("./twitter").Mention = {
      id: "1",
      text: "hello",
      authorId: "a1",
      authorUsername: "user",
      conversationId: "c1",
      parentId: "p1",
    };
    expect(mention.id).toBe("1");
    expect(mention.text).toBe("hello");
    expect(mention.authorId).toBe("a1");
    expect(mention.authorUsername).toBe("user");
    expect(mention.conversationId).toBe("c1");
    expect(mention.parentId).toBe("p1");
  });

  it("Mention allows null conversationId and parentId", () => {
    const mention: import("./twitter").Mention = {
      id: "1", text: "hi", authorId: "a", authorUsername: "u",
      conversationId: null, parentId: null,
    };
    expect(mention.conversationId).toBeNull();
    expect(mention.parentId).toBeNull();
  });
});
