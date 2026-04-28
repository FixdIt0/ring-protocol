/* ── Fee config (matches the FAX token on Printr) ── */
export const PRINTR_FEE = {
  type: "creator" as const,
  bondingCurve: 1.0,        // 1% during bonding
  postGrad: {
    protocol: 0.20,
    provider: 0.40,
    custom: 1.40,            // → this is what funds the RING vault
    total: 2.00,
  },
};

/* ── Vault split ── */
export const SPLIT = {
  launcher: 40,
  target: 30,
  backers: 25,
  protocol: 5,
};

/* ── PvP config ── */
export const PVP = {
  matchWindowMin: 10,        // 2nd launch within 10 min = ring match
  backingWindowMin: 5,       // 5 min to back after launch
  loserPayout: 0,            // losers get nothing
  matchTimeoutHours: 24,     // void if neither graduates in 24h
};

/* ── Backer scoring ── */
export const BACKER = {
  followerCap: 50_000,       // bonus caps at 50K followers
  followerDivisor: 1_000,    // bonus = min(followers/1000, 50)
  earlyMultipliers: [2, 1.5, 1, 1] as readonly number[], // quartile multipliers
};

/* ── Types ── */
export interface Token {
  id: string;
  ticker: string;
  name: string;
  mint: string | null;       // Printr token mint address
  imageUrl: string | null;
  launcherXHandle: string;
  launcherXId: string;
  targetXHandle: string;
  targetXId: string | null;
  tweetId: string;           // the launch tweet
  conversationId: string;    // thread ID for PvP matching
  vaultAddress: string;
  vaultBalance: number;      // SOL accumulated
  status: "bonding" | "graduated" | "dead";
  matchId: string | null;
  createdAt: number;
}

export interface Backer {
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
  role: "launcher" | "target" | "backer";
  amount: number;
  walletAddress: string | null;
  claimed: boolean;
  claimedAt: number | null;
}
