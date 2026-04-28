import Link from "next/link";
import { Marquee } from "@/components/Marquee";

const MOCK_TOKENS = [
  { ticker: "BULL", name: "Bull Mode", mc: "$45K", vol: "142.5 SOL", vault: "1.99 SOL", launcher: "@trader1", target: "@elonmusk", backers: 12, status: "live" },
  { ticker: "BEAR", name: "Bear Mode", mc: "$32K", vol: "98.2 SOL", vault: "1.37 SOL", launcher: "@trader2", target: "@elonmusk", backers: 8, status: "live" },
  { ticker: "CATS", name: "Cat Army", mc: "$89K", vol: "312.0 SOL", vault: "4.37 SOL", launcher: "@catfan", target: "@catcouncil", backers: 24, status: "live" },
  { ticker: "DOGS", name: "Dog Pack", mc: "$76K", vol: "287.4 SOL", vault: "4.02 SOL", launcher: "@dogdev", target: "@catcouncil", backers: 19, status: "live" },
];

export default function TokensPage() {
  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-5xl mx-auto">
      <Marquee text="★ ALL TOKENS ★ LIVE STATS ★ VAULT BALANCES ★" />

      <h1 className="pix-display text-xl sm:text-2xl text-center">
        ALL <span className="ring-gradient">TOKENS</span>
      </h1>

      <div className="mt-10 space-y-4">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-7 gap-4 px-4 pix-display text-[9px] text-white/30">
          <span>TOKEN</span>
          <span>MC</span>
          <span>VOLUME</span>
          <span>VAULT</span>
          <span>LAUNCHER</span>
          <span>TARGET</span>
          <span>STATUS</span>
        </div>

        {MOCK_TOKENS.map((t) => (
          <div key={t.ticker} className="pix-card grid grid-cols-2 sm:grid-cols-7 gap-4 items-center">
            <div>
              <span className="pix-display text-sm ring-gradient">${t.ticker}</span>
              <div className="text-xs text-white/40">{t.name}</div>
            </div>
            <div className="text-sm">{t.mc}</div>
            <div className="text-sm">{t.vol}</div>
            <div className="text-sm ring-gradient font-bold">{t.vault}</div>
            <div className="text-xs text-white/50">{t.launcher}</div>
            <div className="text-xs text-white/50">{t.target}</div>
            <div><span className={t.status === "live" ? "badge-live" : "badge-ended"}>{t.status.toUpperCase()}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
