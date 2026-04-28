import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { PRINTR_FEE, SPLIT, PVP } from "@/lib/types";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    protocol: "RING",
    chain: "solana",
    launchpad: "printr",
    feeConfig: PRINTR_FEE,
    split: SPLIT,
    pvp: PVP,
    stats: store.stats,
  });
}
