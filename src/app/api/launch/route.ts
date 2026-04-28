import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { launchToken } from "@/lib/printr";
import { DEFAULT_SPLITS, type Token, type VaultSplit } from "@/lib/types";

export async function POST(req: Request) {
  const { name, ticker, mode, target, split, wallet } = await req.json();

  if (!name || !ticker || !wallet) {
    return NextResponse.json({ error: "name, ticker, and wallet required" }, { status: 400 });
  }

  const vaultSplit: VaultSplit = split && split.launcher + split.target + split.bulls + split.protocol === 100
    ? split : { ...DEFAULT_SPLITS[mode === "pvp" ? "pvp" : "standard"] };

  // Deploy on Printr
  const creatorWallet = process.env.SVM_WALLET_PUBLIC_KEY ?? "";
  let mint: string | null = null;
  let tokenId = `tok_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  if (creatorWallet) {
    const result = await launchToken({ name, ticker, creatorWallet });
    if (result.error) {
      return NextResponse.json({ error: `Printr: ${result.error}` }, { status: 500 });
    }
    mint = result.mint;
    if (result.tokenId) tokenId = result.tokenId;
  }

  const token: Token = {
    id: tokenId, ticker, name, mint, imageUrl: null,
    launchMode: mode === "pvp" ? "pvp" : "standard", split: vaultSplit,
    launcherXHandle: wallet.slice(0, 8), launcherXId: wallet,
    targetXHandle: target || wallet.slice(0, 8), targetXId: null,
    tweetId: "", conversationId: `web_${Date.now()}`,
    vaultAddress: creatorWallet || `vault_${Date.now()}`, vaultBalance: 0,
    status: "bonding", matchId: null, createdAt: Date.now(),
  };
  store.addToken(token);

  return NextResponse.json({ tokenId: token.id, mint, ticker });
}
