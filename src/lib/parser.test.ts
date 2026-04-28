import { describe, it, expect } from "vitest";
import { parseCommand } from "./parser";

describe("parseCommand — launch basics", () => {
  it("parses minimal launch", () => {
    expect(parseCommand("@RingProtocol launch $BULL Bull Mode")).toEqual({
      kind: "launch", ticker: "BULL", name: "Bull Mode", mode: "standard",
    });
  });
  it("parses with extra @mentions in text", () => {
    const r = parseCommand("@RingProtocol @someone launch $X Coin");
    expect(r?.kind).toBe("launch");
    if (r?.kind === "launch") expect(r.ticker).toBe("X");
  });
  it("uppercases ticker", () => {
    const r = parseCommand("@RingProtocol launch $test Test");
    if (r?.kind === "launch") expect(r.ticker).toBe("TEST");
  });
  it("handles max 10 char ticker", () => {
    const r = parseCommand("@RingProtocol launch $ABCDEFGHIJ Name");
    if (r?.kind === "launch") expect(r.ticker).toBe("ABCDEFGHIJ");
  });
  it("rejects ticker over 10 chars", () => {
    const r = parseCommand("@RingProtocol launch $ABCDEFGHIJK Name");
    expect(r).toBeNull(); // regex won't match \w{1,10}
  });
  it("trims name whitespace", () => {
    const r = parseCommand("@RingProtocol launch $X   Spacey Name  \nto: @a");
    if (r?.kind === "launch") expect(r.name).toBe("Spacey Name");
  });
  it("returns null for empty text", () => { expect(parseCommand("")).toBeNull(); });
  it("returns null for random text", () => { expect(parseCommand("hello world")).toBeNull(); });
  it("returns null for just @mention", () => { expect(parseCommand("@RingProtocol")).toBeNull(); });
  it("returns null for launch without ticker", () => { expect(parseCommand("@RingProtocol launch something")).toBeNull(); });
  it("returns null for launch without $", () => { expect(parseCommand("@RingProtocol launch BULL Name")).toBeNull(); });
});

describe("parseCommand — pvp mode", () => {
  it("detects pvp keyword", () => {
    const r = parseCommand("@RingProtocol launch $FIGHT Fighter pvp");
    if (r?.kind === "launch") expect(r.mode).toBe("pvp");
  });
  it("detects PVP uppercase", () => {
    const r = parseCommand("@RingProtocol launch $X Coin PVP");
    if (r?.kind === "launch") expect(r.mode).toBe("pvp");
  });
  it("detects pvp in separate line", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\npvp");
    if (r?.kind === "launch") expect(r.mode).toBe("pvp");
  });
  it("defaults to standard without pvp", () => {
    const r = parseCommand("@RingProtocol launch $X Coin");
    if (r?.kind === "launch") expect(r.mode).toBe("standard");
  });
});

describe("parseCommand — target", () => {
  it("parses to: field", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nto: @elonmusk");
    if (r?.kind === "launch") expect(r.target).toBe("elonmusk");
  });
  it("strips single @", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nto: @user");
    if (r?.kind === "launch") expect(r.target).toBe("user");
  });
  it("strips multiple @", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nto: @@doubleAt");
    if (r?.kind === "launch") expect(r.target).toBe("doubleAt");
  });
  it("handles no @ prefix", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nto: plainuser");
    if (r?.kind === "launch") expect(r.target).toBe("plainuser");
  });
  it("target is undefined when not specified", () => {
    const r = parseCommand("@RingProtocol launch $X Coin");
    if (r?.kind === "launch") expect(r.target).toBeUndefined();
  });
});

describe("parseCommand — split", () => {
  it("parses valid split", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nsplit: 50/20/25/5");
    if (r?.kind === "launch") expect(r.split).toEqual({ launcher: 50, target: 20, bulls: 25, protocol: 5 });
  });
  it("rejects split not totaling 100", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nsplit: 50/50/50/50");
    if (r?.kind === "launch") expect(r.split).toBeUndefined();
  });
  it("rejects split with 3 parts", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nsplit: 50/25/25");
    if (r?.kind === "launch") expect(r.split).toBeUndefined();
  });
  it("rejects split with non-numbers", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nsplit: a/b/c/d");
    if (r?.kind === "launch") expect(r.split).toBeUndefined();
  });
  it("accepts 100/0/0/0 split", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nsplit: 100/0/0/0");
    if (r?.kind === "launch") expect(r.split).toEqual({ launcher: 100, target: 0, bulls: 0, protocol: 0 });
  });
  it("accepts 0/0/0/100 split", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nsplit: 0/0/0/100");
    if (r?.kind === "launch") expect(r.split).toEqual({ launcher: 0, target: 0, bulls: 0, protocol: 100 });
  });
});

describe("parseCommand — fee params", () => {
  it("parses fee", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nfee: 0.5");
    if (r?.kind === "launch") expect(r.fee).toBe(0.5);
  });
  it("clamps fee to max 1.2", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nfee: 5.0");
    if (r?.kind === "launch") expect(r.fee).toBe(1.2);
  });
  it("clamps fee to min 0", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nfee: -1");
    if (r?.kind === "launch") expect(r.fee).toBe(0);
  });
  it("parses ammfee", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nammfee: 0.3");
    if (r?.kind === "launch") expect(r.ammfee).toBe(0.3);
  });
  it("clamps ammfee to max 1.4", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nammfee: 9");
    if (r?.kind === "launch") expect(r.ammfee).toBe(1.4);
  });
  it("parses liq", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nliq: 75");
    if (r?.kind === "launch") expect(r.liq).toBe(75);
  });
  it("clamps liq to min 60", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nliq: 10");
    if (r?.kind === "launch") expect(r.liq).toBe(60);
  });
  it("clamps liq to max 85", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nliq: 99");
    if (r?.kind === "launch") expect(r.liq).toBe(85);
  });
  it("parses img url", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nimg: https://example.com/img.png");
    if (r?.kind === "launch") expect(r.img).toBe("https://example.com/img.png");
  });
  it("fee is undefined when not specified", () => {
    const r = parseCommand("@RingProtocol launch $X Coin");
    if (r?.kind === "launch") expect(r.fee).toBeUndefined();
  });
});

describe("parseCommand — bull", () => {
  it("parses bull", () => { expect(parseCommand("@RingProtocol bull")).toEqual({ kind: "bull" }); });
  it("parses with whitespace", () => { expect(parseCommand("  @RingProtocol   bull  ")).toEqual({ kind: "bull" }); });
  it("parses case insensitive", () => { expect(parseCommand("@RingProtocol BULL")).toEqual({ kind: "bull" }); });
  it("parses Bull mixed case", () => { expect(parseCommand("@RingProtocol Bull")).toEqual({ kind: "bull" }); });
  it("does not match bull with extra text", () => { expect(parseCommand("@RingProtocol bull please")).toBeNull(); });
});

describe("parseCommand — combined fields", () => {
  it("parses all fields together", () => {
    const r = parseCommand("@RingProtocol launch $MEGA Mega Coin pvp\nto: @vitalik\nsplit: 60/10/25/5\nfee: 0.8\nammfee: 0.5\nliq: 70\nimg: https://img.com/a.png");
    expect(r?.kind).toBe("launch");
    if (r?.kind === "launch") {
      expect(r.ticker).toBe("MEGA");
      expect(r.name).toBe("Mega Coin pvp");
      expect(r.mode).toBe("pvp");
      expect(r.target).toBe("vitalik");
      expect(r.split).toEqual({ launcher: 60, target: 10, bulls: 25, protocol: 5 });
      expect(r.fee).toBe(0.8);
      expect(r.ammfee).toBe(0.5);
      expect(r.liq).toBe(70);
      expect(r.img).toBe("https://img.com/a.png");
    }
  });
});
