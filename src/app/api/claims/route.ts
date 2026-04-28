import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { SPLIT } from "@/lib/types";
import { calcShares } from "@/lib/scoring";

export async function GET(req: Request) {
  const handle = new URL(req.url).searchParams.get("handle");
  if (!handle) return NextResponse.json({ error: "handle required" }, { status: 400 });

  const claims = store.getClaimsForHandle(handle);
  return NextResponse.json(claims);
}

export async function POST(req: Request) {
  const { tokenId, xHandle, role, walletAddress } = await req.json();
  if (!tokenId || !xHandle || !role || !walletAddress) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const token = store.tokens.get(tokenId);
  if (!token) return NextResponse.json({ error: "token not found" }, { status: 404 });

  const vault = token.vaultBalance;
  let amount = 0;

  if (role === "launcher") amount = vault * (SPLIT.launcher / 100);
  else if (role === "target") amount = vault * (SPLIT.target / 100);
  else if (role === "backer") {
    const backers = store.getBackersForToken(tokenId);
    const pool = vault * (SPLIT.backers / 100);
    const shares = calcShares(backers, pool);
    amount = shares.get(xHandle) ?? 0;
  }

  if (amount <= 0) return NextResponse.json({ error: "nothing to claim" }, { status: 400 });

  const claim = {
    id: `claim_${Date.now()}`,
    tokenId, xHandle, role, amount, walletAddress,
    claimed: false, claimedAt: null,
  };
  store.addClaim(claim);

  return NextResponse.json(claim);
}
