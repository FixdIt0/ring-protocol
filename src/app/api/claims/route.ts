import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { PROTOCOL_BUYBACK_FEE } from "@/lib/types";
import { calcShares } from "@/lib/scoring";

export async function GET(req: Request) {
  const handle = new URL(req.url).searchParams.get("handle");
  if (!handle) return NextResponse.json({ error: "handle required" }, { status: 400 });
  return NextResponse.json(store.getClaimsForHandle(handle));
}

export async function POST(req: Request) {
  const { tokenId, xHandle, role, walletAddress } = await req.json();
  if (!tokenId || !xHandle || !role || !walletAddress)
    return NextResponse.json({ error: "missing fields" }, { status: 400 });

  const token = store.tokens.get(tokenId);
  if (!token) return NextResponse.json({ error: "token not found" }, { status: 404 });

  const { split, vaultBalance: vault } = token;
  let gross = 0;

  if (role === "launcher") gross = vault * (split.launcher / 100);
  else if (role === "target") gross = vault * (split.target / 100);
  else if (role === "bull") {
    const bulls = store.getBullsForToken(tokenId);
    const pool = vault * (split.bulls / 100);
    const shares = calcShares(bulls, pool);
    gross = shares.get(xHandle) ?? 0;
  }

  if (gross <= 0) return NextResponse.json({ error: "nothing to claim" }, { status: 400 });

  // 5% protocol fee → RING buyback
  const fee = gross * PROTOCOL_BUYBACK_FEE;
  const net = gross - fee;

  const claim = {
    id: `claim_${Date.now()}`, tokenId, xHandle, role,
    amount: net, walletAddress, claimed: false, claimedAt: null,
  };
  store.addClaim(claim);

  // TODO: execute buyback with `fee` SOL into RING token on DEX

  return NextResponse.json({ ...claim, grossAmount: gross, buybackFee: fee });
}
