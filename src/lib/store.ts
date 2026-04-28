import type { Token, Backer, RingMatch, Claim } from "./types";

/* In-memory store — swap for PostgreSQL in production */
class Store {
  tokens: Map<string, Token> = new Map();
  backers: Backer[] = [];
  matches: Map<string, RingMatch> = new Map();
  claims: Claim[] = [];
  lastMentionId: string | null = null;
  stats = { totalVaults: 0, tokensLaunched: 0, ringMatches: 0, feesClaimed: 0 };

  addToken(t: Token) {
    this.tokens.set(t.id, t);
    this.stats.tokensLaunched++;
    this.stats.totalVaults++;
  }

  getTokensByConversation(convId: string): Token[] {
    return [...this.tokens.values()].filter((t) => t.conversationId === convId);
  }

  addBacker(b: Backer) { this.backers.push(b); }

  getBackersForToken(tokenId: string): Backer[] {
    return this.backers.filter((b) => b.tokenId === tokenId);
  }

  addMatch(m: RingMatch) {
    this.matches.set(m.id, m);
    this.stats.ringMatches++;
  }

  addClaim(c: Claim) { this.claims.push(c); }

  getClaimsForHandle(handle: string): Claim[] {
    return this.claims.filter((c) => c.xHandle.toLowerCase() === handle.toLowerCase());
  }

  toJSON() {
    return {
      tokens: [...this.tokens.values()],
      matches: [...this.matches.values()],
      stats: this.stats,
    };
  }
}

export const store = new Store();
