import { RingTwitterClient } from "./twitter";
import { parseCommand, type LaunchCmd } from "./parser";
import { calcBackerPoints } from "./scoring";
import { store } from "./store";
import { PVP, type Token, type Backer, type RingMatch } from "./types";

const POLL_MS = 60_000;

export class RingBot {
  private twitter: RingTwitterClient;
  private running = false;

  constructor(twitter: RingTwitterClient) { this.twitter = twitter; }

  async start() {
    this.running = true;
    console.log("[ring-bot] started");
    while (this.running) {
      try { await this.poll(); } catch (e) { console.error("[ring-bot] poll error:", e); }
      await new Promise((r) => setTimeout(r, POLL_MS));
    }
  }

  stop() { this.running = false; }

  private async poll() {
    const mentions = await this.twitter.getMentions(store.lastMentionId);
    if (mentions.length === 0) return;
    store.lastMentionId = mentions[mentions.length - 1]!.id;

    for (const m of mentions) {
      const cmd = parseCommand(m.text);
      if (!cmd) continue;

      if (cmd.kind === "launch") await this.handleLaunch(cmd, m);
      else if (cmd.kind === "back") await this.handleBack(m);
    }
  }

  private async handleLaunch(cmd: LaunchCmd, m: { id: string; authorId: string; authorUsername: string; conversationId: string | null; parentId: string | null }) {
    // Resolve target — default to parent tweet author
    let targetHandle = cmd.target ?? "";
    let targetId: string | null = null;
    if (!targetHandle && m.parentId) {
      const parent = await this.twitter.getParentTweet(m.parentId);
      if (parent) { targetHandle = parent.authorUsername; targetId = parent.authorId; }
    }
    if (!targetHandle) targetHandle = m.authorUsername;

    const token: Token = {
      id: `tok_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ticker: cmd.ticker,
      name: cmd.name,
      mint: null,
      imageUrl: cmd.img ?? null,
      launcherXHandle: m.authorUsername,
      launcherXId: m.authorId,
      targetXHandle: targetHandle,
      targetXId: targetId,
      tweetId: m.id,
      conversationId: m.conversationId ?? m.id,
      vaultAddress: `vault_${Date.now()}`,
      vaultBalance: 0,
      status: "bonding",
      matchId: null,
      createdAt: Date.now(),
    };

    store.addToken(token);

    // Check for PvP match — another token in same conversation within window
    const siblings = store.getTokensByConversation(token.conversationId).filter((t) => t.id !== token.id);
    const recent = siblings.find((t) => Date.now() - t.createdAt < PVP.matchWindowMin * 60_000 && !t.matchId);
    if (recent) {
      const match: RingMatch = {
        id: `match_${Date.now()}`,
        tokenAId: recent.id,
        tokenBId: token.id,
        combinedPot: 0,
        winnerId: null,
        status: "live",
        createdAt: Date.now(),
        expiresAt: Date.now() + PVP.matchTimeoutHours * 3600_000,
      };
      store.addMatch(match);
      recent.matchId = match.id;
      token.matchId = match.id;

      await this.twitter.reply(
        `⚔️ RING MATCH!\n\n$${recent.ticker} vs $${token.ticker}\n\nBoth tokens' fees merge into one pot.\nFirst to graduate wins ALL.\nLosers get NOTHING.\n\nBack your fighter: reply "@RingProtocol back"`,
        m.id,
      );
    } else {
      await this.twitter.reply(
        `🥊 $${token.ticker} is LIVE!\n\n${token.name}\nFees → 40% launcher / 30% @${targetHandle} / 25% backers\n\nBack this token: reply "@RingProtocol back" (5 min window)`,
        m.id,
      );
    }

    console.log(`[ring-bot] launched $${token.ticker} id=${token.id} match=${token.matchId ?? "none"}`);
  }

  private async handleBack(m: { id: string; authorId: string; authorUsername: string; conversationId: string | null }) {
    const convId = m.conversationId ?? "";
    const tokens = store.getTokensByConversation(convId);
    const latest = tokens.sort((a, b) => b.createdAt - a.createdAt)[0];
    if (!latest) return;

    if (Date.now() - latest.createdAt > PVP.backingWindowMin * 60_000) {
      await this.twitter.reply("⏰ Backing window closed for this token.", m.id);
      return;
    }

    const existing = store.getBackersForToken(latest.id);
    if (existing.some((b) => b.xId === m.authorId)) return; // already backed

    const followers = await this.twitter.getUserFollowers(m.authorUsername);
    const position = existing.length;
    const totalEstimate = Math.max(position + 5, 10); // estimate for quartile calc
    const points = calcBackerPoints(followers, position, totalEstimate);

    const backer: Backer = {
      xHandle: m.authorUsername,
      xId: m.authorId,
      followers,
      points,
      backedAt: Date.now(),
      tokenId: latest.id,
    };
    store.addBacker(backer);

    console.log(`[ring-bot] @${m.authorUsername} backed $${latest.ticker} pts=${points.toFixed(1)}`);
  }
}
