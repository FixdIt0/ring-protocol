"use client";
import { useEffect, useState } from "react";
import { Marquee } from "@/components/Marquee";

interface Token {
  id: string; ticker: string; name: string; imageUrl: string | null;
  launchMode: string; vaultBalance: number; status: string;
  launcherXHandle: string; targetXHandle: string;
}

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tokens").then(r => r.json()).then(setTokens).finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-5xl mx-auto">
      <Marquee text="★ ALL TOKENS ★ LIVE STATS ★ VAULT BALANCES ★" />
      <h1 className="pix-display text-xl sm:text-2xl text-center">
        ALL <span className="ring-gradient">TOKENS</span>
      </h1>

      <div className="mt-10 space-y-4">
        {loading && <div className="text-center text-white/30 pix-display text-sm py-16">LOADING...</div>}

        {!loading && tokens.length === 0 && (
          <div className="pix-card text-center py-16">
            <div className="pix-display text-white/30">NO TOKENS YET</div>
            <p className="text-white/20 mt-2">Be the first — launch a token from X or the launch page.</p>
          </div>
        )}

        {tokens.map((t) => (
          <div key={t.id} className="pix-card flex items-center gap-4">
            {/* Token image */}
            <div className="w-12 h-12 shrink-0 border-2 border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
              {t.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.imageUrl} alt={t.ticker} className="w-full h-full object-cover" />
              ) : (
                <span className="pix-display text-[10px] text-white/30">{t.ticker[0]}</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="pix-display text-sm ring-gradient">${t.ticker}</span>
                <span className={t.launchMode === "pvp" ? "badge-match" : "badge-live"}>
                  {t.launchMode === "pvp" ? "PVP" : "STD"}
                </span>
                <span className={t.status === "bonding" ? "badge-live" : t.status === "graduated" ? "badge-ended" : "badge-ended"}>
                  {t.status.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-white/40 mt-1 truncate">{t.name}</div>
            </div>

            {/* Vault */}
            <div className="text-right shrink-0">
              <div className="pix-display text-sm ring-gradient">{t.vaultBalance.toFixed(2)} SOL</div>
              <div className="text-[10px] text-white/30">VAULT</div>
            </div>

            {/* Launcher / Target */}
            <div className="text-right shrink-0 hidden sm:block">
              <div className="text-xs text-white/50">@{t.launcherXHandle}</div>
              <div className="text-xs text-white/30">→ @{t.targetXHandle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
