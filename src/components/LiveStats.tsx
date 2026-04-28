"use client";
import { useEffect, useState } from "react";
import { StatCard } from "./StatCard";

interface Stats { totalVaults: number; tokensLaunched: number; ringMatches: number; feesClaimed: number; }

export function LiveStats() {
  const [stats, setStats] = useState<Stats>({ totalVaults: 0, tokensLaunched: 0, ringMatches: 0, feesClaimed: 0 });
  const [totalSol, setTotalSol] = useState(0);

  useEffect(() => {
    const poll = () => {
      fetch("/api/state").then(r => r.json()).then(d => { if (d.stats) setStats(d.stats); });
      fetch("/api/tokens").then(r => r.json()).then((tokens: any[]) => {
        setTotalSol(tokens.reduce((s: number, t: any) => s + (t.vaultBalance || 0), 0));
      });
    };
    poll();
    const id = setInterval(poll, 15_000); // refresh every 15s
    return () => clearInterval(id);
  }, []);

  return (
    <section className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6">
      <StatCard label="TOTAL IN VAULTS" value={totalSol.toFixed(2)} suffix="SOL" variant="gold" />
      <StatCard label="TOKENS LAUNCHED" value={String(stats.tokensLaunched).padStart(3, "0")} />
      <StatCard label="RING MATCHES" value={String(stats.ringMatches).padStart(3, "0")} variant="red" />
      <StatCard label="FEES CLAIMED" value={stats.feesClaimed.toFixed(2)} suffix="SOL" variant="amber" />
    </section>
  );
}
