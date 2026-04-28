import Link from "next/link";
import { RingLogo } from "@/components/RingLogo";
import { Marquee } from "@/components/Marquee";
import { StatCard } from "@/components/StatCard";

export default function Home() {
  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-5xl mx-auto">
      <Marquee text="★ ENTER THE RING ★ LAUNCH TOKENS ★ WINNER TAKES ALL ★ LOSERS GET NOTHING ★ POWERED BY PRINTR ★ SOLANA ONLY ★" />

      <section className="text-center pt-6">
        <div className="flex justify-center mb-8"><RingLogo size={200} /></div>
        <h1 className="pix-display text-2xl sm:text-4xl leading-tight glitch-text">
          LAUNCH TOKENS.<br /><span className="ring-gradient">FIGHT FOR FEES.</span>
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-white/70 max-w-2xl mx-auto">
          Two launch modes. Standard or PvP. Winner pot auto-buys on migration for a massive pump. Losers get nothing.<span className="pix-blink" />
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-5 items-center justify-center">
          <Link href="/launch" className="pix-btn pix-btn-grad">▶ ENTER THE RING</Link>
          <Link href="/arena" className="pix-btn pix-btn-red">⚔ LIVE MATCHES</Link>
          <Link href="/tokens" className="pix-btn">BROWSE TOKENS</Link>
        </div>
      </section>

      <section className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6">
        <StatCard label="TOTAL IN VAULTS" value="0.00" suffix="SOL" variant="gold" />
        <StatCard label="TOKENS LAUNCHED" value="000" />
        <StatCard label="RING MATCHES" value="000" variant="red" />
        <StatCard label="FEES CLAIMED" value="0.00" suffix="SOL" variant="amber" />
      </section>

      {/* Two launch modes */}
      <section className="mt-20">
        <div className="text-center mb-10">
          <h2 className="pix-display text-lg sm:text-xl">TWO MODES</h2>
          <div className="ring-gradient-bar mt-3 mx-auto w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="pix-card pix-card-gold">
            <div className="pix-display text-base ring-gradient">🥊 STANDARD</div>
            <p className="mt-3 text-white/70">Launch a token. Fees split between you, the target, and your bulls. No competition — just earn.</p>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <div><div className="pix-display text-lg ring-gradient">40%</div><div className="text-[9px] text-white/40 pix-display">YOU</div></div>
              <div><div className="pix-display text-lg ring-gradient">30%</div><div className="text-[9px] text-white/40 pix-display">TARGET</div></div>
              <div><div className="pix-display text-lg ring-gradient">25%</div><div className="text-[9px] text-white/40 pix-display">BULLS</div></div>
              <div><div className="pix-display text-lg ring-gradient">5%</div><div className="text-[9px] text-white/40 pix-display">RING</div></div>
            </div>
          </div>
          <div className="pix-card pix-card-red">
            <div className="pix-display text-base ring-gradient">⚔️ PVP</div>
            <p className="mt-3 text-white/70">Launch a token. Someone replies with their own. Both pots merge. First to graduate wins ALL. Winner pot auto-buys on migration 🚀</p>
            <div className="mt-4 text-center">
              <div className="pix-display text-lg ring-gradient">WINNER TAKES ALL</div>
              <div className="text-[9px] text-white/40 pix-display mt-1">LOSERS GET NOTHING</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-20">
        <div className="text-center mb-10">
          <h2 className="pix-display text-lg sm:text-xl">HOW IT WORKS</h2>
          <div className="ring-gradient-bar mt-3 mx-auto w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="pix-card">
            <div className="pix-display text-[10px] text-white/40">01</div>
            <div className="pix-display text-base mt-2 ring-gradient">LAUNCH</div>
            <p className="mt-3 text-white/70">Reply to any tweet with <code className="text-white">@RingProtocol launch $TICKER Name</code>. Add <code className="text-white">pvp</code> for PvP mode.</p>
          </div>
          <div className="pix-card pix-card-red">
            <div className="pix-display text-[10px] text-white/40">02</div>
            <div className="pix-display text-base mt-2 ring-gradient">BULL</div>
            <p className="mt-3 text-white/70">Reply <code className="text-white">@RingProtocol bull</code> to back a token. Bigger X account + earlier = bigger share.</p>
          </div>
          <div className="pix-card pix-card-amber">
            <div className="pix-display text-[10px] text-white/40">03</div>
            <div className="pix-display text-base mt-2 ring-gradient">CLAIM</div>
            <p className="mt-3 text-white/70">Fees accumulate from trading. Claim your split on <span className="ring-gradient">ring.xyz</span> via X login.</p>
          </div>
        </div>
      </section>

      {/* Fee structure */}
      <section className="mt-20">
        <div className="pix-card">
          <div className="pix-display text-[10px] text-white/40 mb-3">FEE STRUCTURE (PRINTR V2)</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><span className="text-white/50">Bonding Curve</span><br /><span className="text-white">1.00%</span></div>
            <div><span className="text-white/50">Protocol (Post-Grad)</span><br /><span className="text-white">0.20%</span></div>
            <div><span className="text-white/50">Provider (Post-Grad)</span><br /><span className="text-white">0.40%</span></div>
            <div><span className="text-white/50">Custom (Post-Grad)</span><br /><span className="ring-gradient font-bold">1.40%</span></div>
          </div>
          <div className="mt-3 text-white/40 text-sm">Split is configurable per launch. Default: 40/30/25/5. Use <code className="text-white/60">split: 50/20/25/5</code> to customize.</div>
        </div>
      </section>

      {/* Auto-buy mechanic */}
      <section className="mt-20 pix-card pix-card-red">
        <div className="text-center">
          <div className="pix-display text-base ring-gradient">🚀 AUTO-BUY ON MIGRATION</div>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">When a PvP winner graduates, the entire combined pot auto-buys the token on the DEX. Massive pump. The bulls ride the wave.</p>
        </div>
      </section>

      {/* Launch from X */}
      <section className="mt-20">
        <div className="text-center mb-10">
          <h2 className="pix-display text-lg sm:text-xl">LAUNCH FROM X</h2>
          <div className="ring-gradient-bar mt-3 mx-auto w-32" />
        </div>
        <div className="pix-card pix-card-red">
          <div className="pix-display text-xs ring-gradient mb-3">STANDARD LAUNCH</div>
          <pre className="text-sm text-white/90 font-mono whitespace-pre-wrap leading-relaxed">{`@RingProtocol launch $TICKER Token Name
to: @recipient        (optional)
split: 40/30/25/5     (optional — launcher/target/bulls/protocol)`}</pre>
          <div className="pix-display text-xs ring-gradient mt-6 mb-3">PVP LAUNCH</div>
          <pre className="text-sm text-white/90 font-mono whitespace-pre-wrap leading-relaxed">{`@RingProtocol launch $TICKER Token Name pvp`}</pre>
          <div className="text-white/50 text-xs mt-1">Someone replies to the same tweet with their own PvP launch → Ring Match activates.</div>
          <div className="pix-display text-xs ring-gradient mt-6 mb-3">BULL UP</div>
          <pre className="text-sm text-white/90 font-mono whitespace-pre-wrap leading-relaxed">{`@RingProtocol bull`}</pre>
          <div className="text-white/50 text-xs mt-1">Reply to any RING launch tweet within 5 minutes.</div>
        </div>
      </section>

      <section className="mt-20 pix-card pix-card-gold">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="pix-display text-sm sm:text-base ring-gradient">READY TO FIGHT?</div>
            <div className="text-white/60 mt-2 text-lg">Pick a tweet. Launch a token. Enter the ring.</div>
          </div>
          <Link href="/launch" className="pix-btn pix-btn-grad shrink-0">ENTER THE RING ▶</Link>
        </div>
      </section>
    </div>
  );
}
