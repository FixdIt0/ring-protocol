import { RingTwitterClient } from "./twitter";
import { parseCommand, type LaunchCmd } from "./parser";
import { calcBullPoints } from "./scoring";
import { store } from "./store";
import { PVP, DEFAULT_SPLITS, type Token, type Bull, type RingMatch, type VaultSplit } from "./types";

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
    if (!mentions.length) return;
    store.lastMentionId = mentions[mentions.length - 1]!.id;
    for (const m of mentions) {
      const cmd = parseCommand(m.text);
      if (!cmd) continue;
      if (cmd.kind === "launch") await this.handleLaunch(cmd, m);
      else if (cmd.kind === "bull") await this.handleBull(m);
    }
  }

  private async handleLaunch(cmd: LaunchCmd, m: { id: string; authorId: string; authorUsername: string; conversationId: string | null; parentId: string | null }) {
    let targetHandle = cmd.target ?? "";
    let targetId: string | null = null;
    if (!targetHandle && m.parentId) {
      const parent = await this.twitter.getParentTweet(m.parentId);
      if (parent) { targetHandle = parent.authorUsername; targetId = parent.authorId; }
    }
    if (!targetHandle) targetHandle = m.authorUsername;

    const split: VaultSplit = cmd.split
      ? { ...DEFAULT_SPLITS[cmd.mode], ...cmd.split }
      : { ...DEFAULT_SPLITS[cmd.mode] };

    const token: Token = {
      id: `tok_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ticker: cmd.ticker, name: cmd.name, mint: null, imageUrl: cmd.img ?? null,
      launchMode: cmd.mode, split,
      launcherXHandle: m.authorUsername, launcherXId: m.authorId,
      targetXHandle: targetHandle, targetXId: targetId,
      tweetId: m.id, conversationId: m.conversationId ?? m.id,
      vaultAddress: `vault_${Date.now()}`, vaultBalance: 0,
      status: "bonding", matchId: null, createdAt: Date.now(),
    };
    store.addToken(token);

    // PvP mode: check for match in same thread
    if (cmd.mode === "pvp") {
      const siblings = store.getTokensByConversation(token.conversationId)
        .filter((t) => t.id !== token.id && t.launchMode === "pvp" && !t.matchId);
      const recent = siblings.find((t) => Date.now() - t.createdAt < PVP.matchWindowMin * 60_000);
      if (recent) {
        const match: RingMatch = {
          id: `match_${Date.now()}`, tokenAId: recent.id, tokenBId: token.id,
          combinedPot: 0, winnerId: null, status: "live",
          createdAt: Date.now(), expiresAt: Date.now() + PVP.matchTimeoutHours * 3600_000,
        };
        store.addMatch(match);
        recent.matchId = match.id;
        token.matchId = match.id;

        await this.twitter.reply(
          `⚔️ RING MATCH!\n\n$${recent.ticker} vs $${token.ticker}\n\nBoth pots merge. First to graduate wins ALL.\nWinner pot auto-buys the coin on migration 🚀\nLosers get NOTHING.\n\nBull up: reply "@RingProtocol bull"`,
          m.id,
        );
        console.log(`[ring-bot] PvP match: $${recent.ticker} vs $${token.ticker}`);
        return;
      }
    }

    const modeLabel = cmd.mode === "pvp" ? "⚔️ PVP" : "🥊 STANDARD";
    await this.twitter.reply(
      `${modeLabel} $${token.ticker} is LIVE!\n\n${token.name}\nSplit: ${split.launcher}% launcher / ${split.target}% @${targetHandle} / ${split.bulls}% bulls\n${cmd.mode === "pvp" ? "Reply to this tweet to challenge with your own token!" : ""}\n\nBull up: reply "@RingProtocol bull"`,
      m.id,
    );
    console.log(`[ring-bot] launched $${token.ticker} mode=${cmd.mode}`);
  }

  private async handleBull(m: { id: string; authorId: string; authorUsername: string; conversationId: string | null }) {
    const convId = m.conversationId ?? "";
    const tokens = store.getTokensByConversation(convId);
    const latest = tokens.sort((a, b) => b.createdAt - a.createdAt)[0];
    if (!latest) return;
    if (Date.now() - latest.createdAt > PVP.bullingWindowMin * 60_000) {
      await this.twitter.reply("⏰ Bull window closed.", m.id);
      return;
    }
    const existing = store.getBullsForToken(latest.id);
    if (existing.some((b) => b.xId === m.authorId)) return;

    const followers = await this.twitter.getUserFollowers(m.authorUsername);
    const points = calcBullPoints(followers, existing.length, Math.max(existing.length + 5, 10));

    const bull: Bull = {
      xHandle: m.authorUsername, xId: m.authorId, followers, points,
      backedAt: Date.now(), tokenId: latest.id,
    };
    store.addBull(bull);
    console.log(`[ring-bot] @${m.authorUsername} bulled $${latest.ticker} pts=${points.toFixed(1)}`);
  }

  // Called when a token graduates — if in a PvP match, auto-buy with winner pot
  async handleGraduation(tokenId: string) {
    const token = store.tokens.get(tokenId);
    if (!token) return;
    token.status = "graduated";

    if (token.matchId) {
      const match = store.matches.get(token.matchId);
      if (match && match.status === "live") {
        match.winnerId = tokenId;
        match.status = "won";
        // Mark loser as dead
        const loserId = match.tokenAId === tokenId ? match.tokenBId : match.tokenAId;
        const loser = store.tokens.get(loserId);
        if (loser) loser.status = "dead";

        console.log(`[ring-bot] MATCH WON: $${token.ticker} wins ${match.combinedPot} SOL — auto-buying on migration`);
        // TODO: execute auto-buy with match.combinedPot on the graduated token's DEX pool
      }
    }
  }
}
