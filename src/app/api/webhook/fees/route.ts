import { NextResponse } from "next/server";
import { store } from "@/lib/store";

// Receives fee notifications — Printr or custom indexer posts here
export async function POST(req: Request) {
  const { tokenId, amount } = await req.json();
  if (!tokenId || typeof amount !== "number") {
    return NextResponse.json({ error: "tokenId and amount required" }, { status: 400 });
  }

  const token = store.tokens.get(tokenId);
  if (!token) return NextResponse.json({ error: "unknown token" }, { status: 404 });

  token.vaultBalance += amount;

  // If in a match, update combined pot
  if (token.matchId) {
    const match = store.matches.get(token.matchId);
    if (match) match.combinedPot += amount;
  }

  return NextResponse.json({ ok: true, vault: token.vaultBalance });
}
