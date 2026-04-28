import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    protocol: "RING",
    chain: "solana",
    launchpad: "printr",
    feeConfig: {
      type: "creator",
      bondingCurve: "1.00%",
      postGrad: { protocol: "0.20%", provider: "0.40%", custom: "1.40%", total: "2.00%" },
    },
    split: { launcher: 40, target: 30, backers: 25, protocol: 5 },
    pvp: { matchWindow: "10min", backingWindow: "5min", loserPayout: 0 },
    stats: { totalVaults: 0, tokensLaunched: 0, ringMatches: 0, feesClaimed: 0 },
  });
}
