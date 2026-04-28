/* ── RING token CA ── */
export const RING_CA = "A6PnrEfGjMwX2or2Tiqx8tUXVNHeivJq3xWgGAPjbrrr";

/* ── Fee config (matches FAX token on Printr) ── */
export const PRINTR_FEE = {
  type: "creator" as const,
  bondingCurve: 1.0,
  postGrad: { protocol: 0.20, provider: 0.40, custom: 1.40, total: 2.00 },
};

/* ── Launch modes ── */
export type LaunchMode = "standard" | "pvp";

/* ── Default splits (configurable per token) ── */
export const DEFAULT_SPLITS = {
  standard: { launcher: 40, target: 30, bulls: 25, protocol: 5 },
  pvp: { launcher: 40, target: 30, bulls: 25, protocol: 5 },
} as const;

export interface VaultSplit {
  launcher: number;
  target: number;
  bulls: number;
  protocol: number;
}

/* ── PvP config ── */
export const PVP = {
  matchWindowMin: 10,
  bullingWindowMin: 5,
  loserPayout: 0,
  matchTimeoutHours: 24,
  autoBuyOnMigration: true, // winner pot auto-buys the token on graduation
};

/* ── Protocol buyback fee — taken from every claim payout ── */
export const PROTOCOL_BUYBACK_FEE = 0.05; // 5% of every claim → buyback into RING chart

/* ── Bull scoring ── */
export const BULL = {
  followerCap: 50_000,
  followerDivisor: 1_000,
  earlyMultipliers: [2, 1.5, 1, 1] as readonly number[],
};

/* ── Types ── */
export interface Token {
  id: string;
  ticker: string;
  name: string;
  mint: string | null;
  imageUrl: string | null;
  launchMode: LaunchMode;
  split: VaultSplit;
  launcherXHandle: string;
  launcherXId: string;
  targetXHandle: string;
  targetXId: string | null;
  tweetId: string;
  conversationId: string;
  vaultAddress: string;
  vaultBalance: number;
  status: "bonding" | "graduated" | "dead";
  matchId: string | null;
  createdAt: number;
}

export interface Bull {
  xHandle: string;
  xId: string;
  followers: number;
  points: number;
  backedAt: number;
  tokenId: string;
}

export interface RingMatch {
  id: string;
  tokenAId: string;
  tokenBId: string;
  combinedPot: number;
  winnerId: string | null;
  status: "live" | "won" | "void";
  createdAt: number;
  expiresAt: number;
}

export interface Claim {
  id: string;
  tokenId: string;
  xHandle: string;
  role: "launcher" | "target" | "bull";
  amount: number;
  walletAddress: string | null;
  claimed: boolean;
  claimedAt: number | null;
}
