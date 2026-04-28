import { describe, it, expect } from "vitest";
import { parseCommand } from "./parser";

describe("parseCommand", () => {
  it("parses a basic launch", () => {
    const r = parseCommand("@RingProtocol launch $BULL Bull Mode");
    expect(r).toEqual({ kind: "launch", ticker: "BULL", name: "Bull Mode", mode: "standard" });
  });

  it("parses pvp launch", () => {
    const r = parseCommand("@RingProtocol launch $FIGHT Fighter pvp");
    expect(r?.kind).toBe("launch");
    if (r?.kind === "launch") expect(r.mode).toBe("pvp");
  });

  it("parses launch with target", () => {
    const r = parseCommand("@RingProtocol launch $TEST Test\nto: @elonmusk");
    expect(r?.kind).toBe("launch");
    if (r?.kind === "launch") expect(r.target).toBe("elonmusk");
  });

  it("parses launch with custom split", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nsplit: 50/20/25/5");
    expect(r?.kind).toBe("launch");
    if (r?.kind === "launch") {
      expect(r.split).toEqual({ launcher: 50, target: 20, bulls: 25, protocol: 5 });
    }
  });

  it("rejects split that doesnt total 100", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nsplit: 50/50/50/50");
    expect(r?.kind).toBe("launch");
    if (r?.kind === "launch") expect(r.split).toBeUndefined();
  });

  it("parses launch with fee params", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nfee: 0.5\nammfee: 0.3\nliq: 75");
    expect(r?.kind).toBe("launch");
    if (r?.kind === "launch") {
      expect(r.fee).toBe(0.5);
      expect(r.ammfee).toBe(0.3);
      expect(r.liq).toBe(75);
    }
  });

  it("clamps fee to max 1.2", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nfee: 5.0");
    if (r?.kind === "launch") expect(r.fee).toBe(1.2);
  });

  it("parses launch with image url", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nimg: https://example.com/img.png");
    if (r?.kind === "launch") expect(r.img).toBe("https://example.com/img.png");
  });

  it("parses bull command", () => {
    const r = parseCommand("@RingProtocol bull");
    expect(r).toEqual({ kind: "bull" });
  });

  it("parses bull with extra whitespace", () => {
    const r = parseCommand("  @RingProtocol   bull  ");
    expect(r).toEqual({ kind: "bull" });
  });

  it("returns null for unrecognized text", () => {
    expect(parseCommand("@RingProtocol hello")).toBeNull();
    expect(parseCommand("random tweet")).toBeNull();
  });

  it("handles ticker max 10 chars", () => {
    const r = parseCommand("@RingProtocol launch $ABCDEFGHIJ Long Name");
    if (r?.kind === "launch") expect(r.ticker).toBe("ABCDEFGHIJ");
  });

  it("uppercases ticker", () => {
    const r = parseCommand("@RingProtocol launch $test Test");
    if (r?.kind === "launch") expect(r.ticker).toBe("TEST");
  });

  it("strips @ from target", () => {
    const r = parseCommand("@RingProtocol launch $X Coin\nto: @@doubleAt");
    if (r?.kind === "launch") expect(r.target).toBe("doubleAt");
  });
});
