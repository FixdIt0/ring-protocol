"use client";
import { useEffect, useState } from "react";
import { Marquee } from "@/components/Marquee";

interface Claim { id: string; tokenId: string; role: string; amount: number; claimed: boolean; }
interface Session { xHandle?: string; xId?: string; }

export default function ClaimsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(s => {
      if (s?.xHandle) { setSession(s); return s.xHandle; }
      setLoading(false); return null;
    }).then(handle => {
      if (!handle) return;
      fetch(`/api/claims?handle=${handle}`).then(r => r.json()).then(setClaims).finally(() => setLoading(false));
    });
  }, []);

  const total = claims.reduce((s, c) => s + (c.claimed ? 0 : c.amount), 0);

  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-3xl mx-auto">
      <Marquee text="★ CLAIM YOUR FEES ★ CONNECT X ★ CONNECT WALLET ★" />
      <h1 className="pix-display text-xl sm:text-2xl text-center">
        CLAIM <span className="ring-gradient">YOUR FEES</span>
      </h1>

      <div className="mt-10 space-y-6">
        {/* Step 1: X Login */}
        <div className="pix-card">
          <div className="pix-display text-[10px] text-white/40 mb-3">STEP 1</div>
          <div className="pix-display text-base ring-gradient">CONNECT X ACCOUNT</div>
          {session ? (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-white">@{session.xHandle}</span>
              <span className="badge-live">CONNECTED</span>
            </div>
          ) : (
            <>
              <p className="text-white/50 mt-2">Sign in with X to find your claimable fees.</p>
              <button onClick={() => window.location.href = "/api/auth/signin/twitter"} className="pix-btn mt-4 w-full flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                SIGN IN WITH X
              </button>
            </>
          )}
        </div>

        {/* Step 2: Claims */}
        <div className={`pix-card pix-card-gold ${!session ? "opacity-50" : ""}`}>
          <div className="pix-display text-[10px] text-white/40 mb-3">YOUR CLAIMS</div>
          {loading && <div className="text-center text-white/30 py-8">LOADING...</div>}
          {!loading && !session && <div className="text-center text-white/30 py-8">Sign in to see claims</div>}
          {!loading && session && claims.length === 0 && <div className="text-center text-white/30 py-8">No claimable fees yet</div>}
          {claims.length > 0 && (
            <>
              <div className="text-center mb-4">
                <div className="pix-display text-3xl ring-gradient">{total.toFixed(4)} SOL</div>
                <div className="text-white/40 text-sm mt-1">TOTAL CLAIMABLE</div>
              </div>
              <div className="space-y-2">
                {claims.filter(c => !c.claimed).map(c => (
                  <div key={c.id} className="flex items-center justify-between border border-white/10 p-3">
                    <div>
                      <span className="pix-display text-[10px] text-white/50">{c.role.toUpperCase()}</span>
                      <div className="text-sm text-white/70">{c.tokenId.slice(0, 12)}...</div>
                    </div>
                    <div className="text-right">
                      <div className="ring-gradient pix-display text-sm">{c.amount.toFixed(4)} SOL</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="pix-btn pix-btn-grad w-full mt-4">CONNECT WALLET TO CLAIM</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
