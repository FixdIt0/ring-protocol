import type { LaunchMode, VaultSplit } from "./types";
import { DEFAULT_SPLITS } from "./types";

export interface LaunchCmd {
  kind: "launch";
  ticker: string;
  name: string;
  mode: LaunchMode;
  target?: string;
  split?: Partial<VaultSplit>;
  fee?: number;
  ammfee?: number;
  liq?: number;
  img?: string;
}

export interface BullCmd { kind: "bull"; }
export type ParsedCmd = LaunchCmd | BullCmd | null;

const LAUNCH_RE = /launch\s+\$(\w{1,10})\s+(.+?)(?:\n|$)/i;
const FIELD_RE = (key: string) => new RegExp(`${key}:\\s*(.+?)(?:\\n|$)`, "i");

export function parseCommand(text: string): ParsedCmd {
  const clean = text.replace(/@\w+/g, "").trim();
  if (/^\s*bull\s*$/i.test(clean)) return { kind: "bull" };

  const m = LAUNCH_RE.exec(clean);
  if (!m) return null;

  const mode: LaunchMode = /pvp/i.test(text) ? "pvp" : "standard";
  const cmd: LaunchCmd = { kind: "launch", ticker: m[1]!.toUpperCase(), name: m[2]!.trim(), mode };

  const to = FIELD_RE("to").exec(text);
  if (to) cmd.target = to[1]!.trim().replace(/^@+/, "");

  // Configurable split — e.g. "split: 50/20/25/5"
  const splitMatch = FIELD_RE("split").exec(text);
  if (splitMatch) {
    const parts = splitMatch[1]!.split("/").map((s) => parseInt(s.trim()));
    if (parts.length === 4 && parts.every((n) => !isNaN(n)) && parts.reduce((a, b) => a + b, 0) === 100) {
      cmd.split = { launcher: parts[0]!, target: parts[1]!, bulls: parts[2]!, protocol: parts[3]! };
    }
  }

  const fee = FIELD_RE("fee").exec(text);
  if (fee) cmd.fee = Math.min(1.2, Math.max(0, parseFloat(fee[1]!) || 0));
  const ammfee = FIELD_RE("ammfee").exec(text);
  if (ammfee) cmd.ammfee = Math.min(1.4, Math.max(0, parseFloat(ammfee[1]!) || 0));
  const liq = FIELD_RE("liq").exec(text);
  if (liq) cmd.liq = Math.min(85, Math.max(60, parseInt(liq[1]!) || 80));
  const img = FIELD_RE("img").exec(text);
  if (img) cmd.img = img[1]!.trim();

  return cmd;
}
