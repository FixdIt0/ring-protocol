import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { PRINTR_FEE, DEFAULT_SPLITS, PVP, RING_CA } from "@/lib/types";

export async function GET() {
  const tokens = [...store.tokens.values()];
  const totalVaultSol = tokens.reduce((s, t) => s + t.vaultBalance, 0);

  return NextResponse.json({
    status: "ok",
    protocol: "RING",
    ca: RING_CA,
    chain: "solana",
    launchpad: "printr",
    feeConfig: PRINTR_FEE,
    splits: DEFAULT_SPLITS,
    pvp: PVP,
    stats: {
      ...store.stats,
      totalVaultSol,
    },
  });
}
