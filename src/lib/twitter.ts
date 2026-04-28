import { TwitterApi, ApiResponseError } from "twitter-api-v2";

const RETRY_DELAYS = [30_000, 60_000, 120_000];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isRateLimit = (e: unknown) => e instanceof ApiResponseError && e.rateLimitError;

export interface Mention {
  id: string;
  text: string;
  authorId: string;
  authorUsername: string;
  conversationId: string | null;
  parentId: string | null;
}

export class RingTwitterClient {
  private client: TwitterApi | null;
  private userId: string | null = null;
  private dryRun: boolean;

  constructor(opts: {
    apiKey?: string; apiSecret?: string;
    accessToken?: string; accessSecret?: string;
    dryRun?: boolean;
  }) {
    this.dryRun = opts.dryRun ?? false;
    if (this.dryRun || !opts.apiKey) {
      this.client = null;
      console.log("[ring-x] dry-run mode");
      return;
    }
    this.client = new TwitterApi({
      appKey: opts.apiKey,
      appSecret: opts.apiSecret!,
      accessToken: opts.accessToken!,
      accessSecret: opts.accessSecret!,
    });
    console.log("[ring-x] live mode");
  }

  async getMe(): Promise<string> {
    if (!this.client) return "dry_run";
    if (this.userId) return this.userId;
    const r = await this.client.v2.me();
    this.userId = r.data.id;
    return this.userId;
  }

  async reply(text: string, replyTo: string): Promise<string | null> {
    if (!this.client) { console.log(`[ring-x] DRY reply to=${replyTo}: ${text}`); return "dry_" + Date.now(); }
    for (let i = 0; i < RETRY_DELAYS.length; i++) {
      try {
        const r = await this.client.v2.reply(text, replyTo);
        return r.data.id;
      } catch (e) {
        if (isRateLimit(e)) console.warn(`[ring-x] rate limited reply attempt ${i + 1}`);
        else console.error(`[ring-x] reply error attempt ${i + 1}:`, e);
        await sleep(RETRY_DELAYS[i]!);
      }
    }
    return null;
  }

  async getMentions(sinceId: string | null): Promise<Mention[]> {
    if (!this.client) return [];
    for (let i = 0; i < RETRY_DELAYS.length; i++) {
      try {
        const me = await this.getMe();
        const r = await this.client.v2.userMentionTimeline(me, {
          since_id: sinceId ?? undefined,
          "tweet.fields": ["author_id", "conversation_id", "referenced_tweets"],
          expansions: ["author_id"],
          "user.fields": ["username", "public_metrics"],
          max_results: 20,
        });
        const users = new Map<string, { username: string; followers: number }>();
        for (const u of r.includes?.users ?? []) {
          users.set(u.id, { username: u.username, followers: (u as any).public_metrics?.followers_count ?? 0 });
        }
        return (r.tweets ?? []).map((t) => {
          const ref = t.referenced_tweets?.find((r) => r.type === "replied_to");
          return {
            id: t.id,
            text: t.text,
            authorId: t.author_id ?? "",
            authorUsername: users.get(t.author_id ?? "")?.username ?? "unknown",
            conversationId: t.conversation_id ?? null,
            parentId: ref?.id ?? null,
          };
        });
      } catch (e) {
        if (isRateLimit(e)) console.warn(`[ring-x] rate limited mentions attempt ${i + 1}`);
        else console.error(`[ring-x] mentions error:`, e);
        await sleep(RETRY_DELAYS[i]!);
      }
    }
    return [];
  }

  async getUserFollowers(username: string): Promise<number> {
    if (!this.client) return 0;
    try {
      const r = await this.client.v2.userByUsername(username, { "user.fields": ["public_metrics"] });
      return (r.data as any)?.public_metrics?.followers_count ?? 0;
    } catch { return 0; }
  }

  async getParentTweet(tweetId: string): Promise<{ authorId: string; authorUsername: string } | null> {
    if (!this.client) return null;
    try {
      const r = await this.client.v2.singleTweet(tweetId, {
        "tweet.fields": ["author_id"],
        expansions: ["author_id"],
        "user.fields": ["username"],
      });
      const user = r.includes?.users?.[0];
      return { authorId: r.data.author_id ?? "", authorUsername: user?.username ?? "unknown" };
    } catch { return null; }
  }
}
