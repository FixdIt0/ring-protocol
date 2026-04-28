import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { PRINTR_FEE, DEFAULT_SPLITS, PVP } from "@/lib/types";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    protocol: "RING",
    chain: "solana",
    launchpad: "printr",
    feeConfig: PRINTR_FEE,
    splits: DEFAULT_SPLITS,
    pvp: PVP,
    stats: store.stats,
  });
}
