/* Parses @RingProtocol launch/back commands from tweet text */

export interface LaunchCmd {
  kind: "launch";
  ticker: string;
  name: string;
  target?: string;       // @handle override
  fee?: number;
  ammfee?: number;
  liq?: number;
  img?: string;
}

export interface BackCmd { kind: "back"; }

export type ParsedCmd = LaunchCmd | BackCmd | null;

const LAUNCH_RE = /launch\s+\$(\w{1,10})\s+(.+?)(?:\n|$)/i;
const FIELD_RE = (key: string) => new RegExp(`${key}:\\s*(.+?)(?:\\n|$)`, "i");

export function parseCommand(text: string): ParsedCmd {
  const clean = text.replace(/@\w+/g, "").trim();

  if (/^\s*back\s*$/i.test(clean)) return { kind: "back" };

  const m = LAUNCH_RE.exec(clean);
  if (!m) return null;

  const cmd: LaunchCmd = { kind: "launch", ticker: m[1]!.toUpperCase(), name: m[2]!.trim() };

  const to = FIELD_RE("to").exec(text);
  if (to) cmd.target = to[1]!.trim().replace(/^@/, "");

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
