import pg from "pg";
import type { Token, Bull, RingMatch, Claim } from "./types";

const pool = process.env.DATABASE_URL
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

export async function initDb() {
  if (!pool) { console.warn("[db] DATABASE_URL not set — using in-memory store"); return; }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tokens (
      id TEXT PRIMARY KEY, ticker TEXT NOT NULL, name TEXT NOT NULL,
      mint TEXT, image_url TEXT, launch_mode TEXT NOT NULL, split JSONB NOT NULL,
      launcher_x_handle TEXT, launcher_x_id TEXT, target_x_handle TEXT, target_x_id TEXT,
      tweet_id TEXT, conversation_id TEXT, vault_address TEXT, vault_balance REAL DEFAULT 0,
      status TEXT DEFAULT 'bonding', match_id TEXT, created_at BIGINT
    );
    CREATE TABLE IF NOT EXISTS bulls (
      id SERIAL PRIMARY KEY, x_handle TEXT, x_id TEXT, followers INT,
      points REAL, backed_at BIGINT, token_id TEXT REFERENCES tokens(id)
    );
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY, token_a_id TEXT, token_b_id TEXT,
      combined_pot REAL DEFAULT 0, winner_id TEXT, status TEXT DEFAULT 'live',
      created_at BIGINT, expires_at BIGINT
    );
    CREATE TABLE IF NOT EXISTS claims (
      id TEXT PRIMARY KEY, token_id TEXT, x_handle TEXT, role TEXT,
      amount REAL, wallet_address TEXT, claimed BOOLEAN DEFAULT false, claimed_at BIGINT
    );
    CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT);
  `);
  console.log("[db] schema initialized");
}

// ── Tokens ──
export async function dbAddToken(t: Token) {
  if (!pool) return;
  await pool.query(
    `INSERT INTO tokens (id,ticker,name,mint,image_url,launch_mode,split,launcher_x_handle,launcher_x_id,target_x_handle,target_x_id,tweet_id,conversation_id,vault_address,vault_balance,status,match_id,created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
     ON CONFLICT (id) DO NOTHING`,
    [t.id, t.ticker, t.name, t.mint, t.imageUrl, t.launchMode, JSON.stringify(t.split),
     t.launcherXHandle, t.launcherXId, t.targetXHandle, t.targetXId,
     t.tweetId, t.conversationId, t.vaultAddress, t.vaultBalance, t.status, t.matchId, t.createdAt]
  );
}

export async function dbGetTokens(): Promise<Token[]> {
  if (!pool) return [];
  const { rows } = await pool.query("SELECT * FROM tokens ORDER BY created_at DESC");
  return rows.map(rowToToken);
}

export async function dbUpdateToken(id: string, fields: Partial<Token>) {
  if (!pool) return;
  const sets: string[] = []; const vals: any[] = []; let i = 1;
  for (const [k, v] of Object.entries(fields)) {
    const col = k.replace(/([A-Z])/g, "_$1").toLowerCase();
    sets.push(`${col} = $${i}`); vals.push(k === "split" ? JSON.stringify(v) : v); i++;
  }
  if (sets.length === 0) return;
  vals.push(id);
  await pool.query(`UPDATE tokens SET ${sets.join(", ")} WHERE id = $${i}`, vals);
}

// ── Bulls ──
export async function dbAddBull(b: Bull) {
  if (!pool) return;
  await pool.query(
    `INSERT INTO bulls (x_handle,x_id,followers,points,backed_at,token_id) VALUES ($1,$2,$3,$4,$5,$6)`,
    [b.xHandle, b.xId, b.followers, b.points, b.backedAt, b.tokenId]
  );
}

export async function dbGetBullsForToken(tokenId: string): Promise<Bull[]> {
  if (!pool) return [];
  const { rows } = await pool.query("SELECT * FROM bulls WHERE token_id = $1", [tokenId]);
  return rows.map(r => ({ xHandle: r.x_handle, xId: r.x_id, followers: r.followers, points: r.points, backedAt: r.backed_at, tokenId: r.token_id }));
}

// ── Matches ──
export async function dbAddMatch(m: RingMatch) {
  if (!pool) return;
  await pool.query(
    `INSERT INTO matches (id,token_a_id,token_b_id,combined_pot,winner_id,status,created_at,expires_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [m.id, m.tokenAId, m.tokenBId, m.combinedPot, m.winnerId, m.status, m.createdAt, m.expiresAt]
  );
}

export async function dbUpdateMatch(id: string, fields: Partial<RingMatch>) {
  if (!pool) return;
  const sets: string[] = []; const vals: any[] = []; let i = 1;
  for (const [k, v] of Object.entries(fields)) {
    const col = k.replace(/([A-Z])/g, "_$1").toLowerCase();
    sets.push(`${col} = $${i}`); vals.push(v); i++;
  }
  vals.push(id);
  await pool.query(`UPDATE matches SET ${sets.join(", ")} WHERE id = $${i}`, vals);
}

// ── Claims ──
export async function dbAddClaim(c: Claim) {
  if (!pool) return;
  await pool.query(
    `INSERT INTO claims (id,token_id,x_handle,role,amount,wallet_address,claimed,claimed_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [c.id, c.tokenId, c.xHandle, c.role, c.amount, c.walletAddress, c.claimed, c.claimedAt]
  );
}

export async function dbGetClaimsForHandle(handle: string): Promise<Claim[]> {
  if (!pool) return [];
  const { rows } = await pool.query("SELECT * FROM claims WHERE LOWER(x_handle) = LOWER($1)", [handle]);
  return rows.map(r => ({ id: r.id, tokenId: r.token_id, xHandle: r.x_handle, role: r.role, amount: r.amount, walletAddress: r.wallet_address, claimed: r.claimed, claimedAt: r.claimed_at }));
}

// ── KV (for lastMentionId etc) ──
export async function dbGetKv(key: string): Promise<string | null> {
  if (!pool) return null;
  const { rows } = await pool.query("SELECT value FROM kv WHERE key = $1", [key]);
  return rows[0]?.value ?? null;
}

export async function dbSetKv(key: string, value: string) {
  if (!pool) return;
  await pool.query("INSERT INTO kv (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2", [key, value]);
}

function rowToToken(r: any): Token {
  return {
    id: r.id, ticker: r.ticker, name: r.name, mint: r.mint, imageUrl: r.image_url,
    launchMode: r.launch_mode, split: typeof r.split === "string" ? JSON.parse(r.split) : r.split,
    launcherXHandle: r.launcher_x_handle, launcherXId: r.launcher_x_id,
    targetXHandle: r.target_x_handle, targetXId: r.target_x_id,
    tweetId: r.tweet_id, conversationId: r.conversation_id,
    vaultAddress: r.vault_address, vaultBalance: r.vault_balance,
    status: r.status, matchId: r.match_id, createdAt: r.created_at,
  };
}

export { pool };
