import type { Token, Bull, RingMatch, Claim } from "./types";

class Store {
  tokens: Map<string, Token> = new Map();
  bulls: Bull[] = [];
  matches: Map<string, RingMatch> = new Map();
  claims: Claim[] = [];
  lastMentionId: string | null = null;
  stats = { totalVaults: 0, tokensLaunched: 0, ringMatches: 0, feesClaimed: 0 };

  addToken(t: Token) { this.tokens.set(t.id, t); this.stats.tokensLaunched++; this.stats.totalVaults++; }
  getTokensByConversation(convId: string): Token[] { return [...this.tokens.values()].filter((t) => t.conversationId === convId); }
  addBull(b: Bull) { this.bulls.push(b); }
  getBullsForToken(tokenId: string): Bull[] { return this.bulls.filter((b) => b.tokenId === tokenId); }
  addMatch(m: RingMatch) { this.matches.set(m.id, m); this.stats.ringMatches++; }
  addClaim(c: Claim) { this.claims.push(c); }
  getClaimsForHandle(handle: string): Claim[] { return this.claims.filter((c) => c.xHandle.toLowerCase() === handle.toLowerCase()); }
}

export const store = new Store();
