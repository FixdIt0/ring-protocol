import { Marquee } from "@/components/Marquee";

export default function DocsPage() {
  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-3xl mx-auto">
      <Marquee text="★ DOCS ★ HOW RING WORKS ★ LAUNCH ★ BULL ★ CLAIM ★" />

      <h1 className="pix-display text-xl sm:text-2xl text-center">
        <span className="ring-gradient">DOCUMENTATION</span>
      </h1>

      <div className="mt-10 space-y-10">

        {/* What is RING */}
        <section className="pix-card">
          <h2 className="pix-display text-sm ring-gradient">WHAT IS RING?</h2>
          <p className="mt-3 text-white/70">
            RING is a competitive token launch protocol built on Printr (Solana). Launch a token from any tweet on X.
            Trading fees accumulate in a vault and split between the launcher, the target, and the bulls.
          </p>
        </section>

        {/* The Target */}
        <section className="pix-card pix-card-red">
          <h2 className="pix-display text-sm ring-gradient">WHO IS THE TARGET?</h2>
          <p className="mt-3 text-white/70">
            The target is the person whose tweet you replied to when launching. If you reply to @elonmusk&apos;s tweet
            with a launch command, Elon is the target — they receive 30% of all trading fees.
          </p>
          <p className="mt-3 text-white/70">
            <strong className="text-white">The target doesn&apos;t need to do anything upfront.</strong> Their fees accumulate
            automatically. They claim by logging in with X on ring.xyz and connecting a wallet.
          </p>
          <div className="mt-4 pix-card pix-card-gold">
            <div className="pix-display text-[10px] ring-gradient">🎯 THE MISSION</div>
            <p className="mt-2 text-white/70">
              Once you launch a token about someone, it&apos;s your job — and your bulls&apos; mission — to get the target
              to notice, claim their fees, and interact with the token. When a big account claims and engages,
              that&apos;s the ultimate pump catalyst. Their audience sees it. Volume follows. Everyone wins.
            </p>
            <p className="mt-2 text-white/50 text-sm">
              The target claiming is the signal. It means the person behind the token is real, engaged, and paying attention.
              That&apos;s what drives organic demand.
            </p>
          </div>
        </section>

        {/* Launch Modes */}
        <section className="pix-card">
          <h2 className="pix-display text-sm ring-gradient">LAUNCH MODES</h2>

          <div className="mt-4 space-y-4">
            <div className="border-2 border-white/10 p-4">
              <div className="pix-display text-[10px] ring-gradient">🥊 STANDARD</div>
              <p className="mt-2 text-white/70">
                Launch a token. Fees split between you (launcher), the target, and your bulls. No competition.
                Build your community, get the target to claim, and ride the volume.
              </p>
            </div>

            <div className="border-2 border-red-500/30 p-4">
              <div className="pix-display text-[10px] ring-gradient">⚔️ PVP</div>
              <p className="mt-2 text-white/70">
                Launch a token with <code className="text-white">pvp</code> in the command. If someone replies to the same
                tweet thread with their own PvP launch within 10 minutes, a Ring Match activates. Both tokens&apos; fee
                vaults merge into one pot. First token to graduate (complete the bonding curve and migrate to DEX) wins
                the entire combined pot. Losers get nothing.
              </p>
              <p className="mt-2 text-white/50 text-sm">
                The winner&apos;s pot auto-buys the token on the DEX the moment it migrates — massive pump catalyst.
              </p>
            </div>
          </div>
        </section>

        {/* Bulls */}
        <section className="pix-card pix-card-amber">
          <h2 className="pix-display text-sm ring-gradient">BULLS</h2>
          <p className="mt-3 text-white/70">
            Bulls are the community behind a token. Reply <code className="text-white">@RingProtocol bull</code> to any
            launch tweet within 5 minutes to bull up. Bulls share 25% of the vault (default).
          </p>
          <div className="mt-3 text-sm text-white/50">
            <div className="pix-display text-[10px] text-white/40 mb-2">SCORING</div>
            <ul className="space-y-1">
              <li>• Base: 1 point per bull</li>
              <li>• Follower bonus: +1 point per 1,000 followers (capped at 50K)</li>
              <li>• Early bonus: first 25% of bulls get 2× multiplier, next 25% get 1.5×</li>
            </ul>
          </div>
          <p className="mt-3 text-white/50 text-sm">
            Bigger accounts earn more. Earlier bulls earn more. But the cap prevents whales from taking everything.
          </p>
        </section>

        {/* Vault Split */}
        <section className="pix-card">
          <h2 className="pix-display text-sm ring-gradient">VAULT SPLIT</h2>
          <p className="mt-3 text-white/70">
            Every token has a configurable fee split. The default is:
          </p>
          <div className="mt-4 grid grid-cols-4 gap-4 text-center">
            <div><div className="pix-display text-lg ring-gradient">40%</div><div className="text-[9px] text-white/40 pix-display">LAUNCHER</div></div>
            <div><div className="pix-display text-lg ring-gradient">30%</div><div className="text-[9px] text-white/40 pix-display">TARGET</div></div>
            <div><div className="pix-display text-lg ring-gradient">25%</div><div className="text-[9px] text-white/40 pix-display">BULLS</div></div>
            <div><div className="pix-display text-lg ring-gradient">5%</div><div className="text-[9px] text-white/40 pix-display">PROTOCOL</div></div>
          </div>
          <p className="mt-3 text-white/50 text-sm">
            Customize with <code className="text-white/70">split: 50/20/25/5</code> in your launch command. Must total 100%.
          </p>
        </section>

        {/* Fee Structure */}
        <section className="pix-card">
          <h2 className="pix-display text-sm ring-gradient">FEE STRUCTURE (PRINTR V2)</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-white/50">Bonding Curve Fee</span><span>1.00%</span></div>
            <div className="flex justify-between"><span className="text-white/50">Protocol Fee (Post-Grad)</span><span>0.20%</span></div>
            <div className="flex justify-between"><span className="text-white/50">Provider Fee (Post-Grad)</span><span>0.40%</span></div>
            <div className="flex justify-between"><span className="text-white/50">Custom Fee (Post-Grad)</span><span className="ring-gradient font-bold">1.40%</span></div>
            <div className="border-t border-white/10 pt-2 flex justify-between"><span className="text-white/50">Total Post-Grad</span><span>2.00%</span></div>
          </div>
          <p className="mt-3 text-white/50 text-sm">
            The 1.40% custom fee is what funds the RING vault. This is where your split comes from.
          </p>
        </section>

        {/* X Commands */}
        <section className="pix-card pix-card-red">
          <h2 className="pix-display text-sm ring-gradient">X COMMANDS</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <div className="pix-display text-[10px] text-white/40">STANDARD LAUNCH</div>
              <pre className="mt-1 text-white/90 font-mono whitespace-pre-wrap">{`@RingProtocol launch $TICKER Token Name
to: @recipient        (optional — defaults to tweet author)
split: 40/30/25/5     (optional)`}</pre>
            </div>
            <div>
              <div className="pix-display text-[10px] text-white/40">PVP LAUNCH</div>
              <pre className="mt-1 text-white/90 font-mono whitespace-pre-wrap">{`@RingProtocol launch $TICKER Token Name pvp`}</pre>
            </div>
            <div>
              <div className="pix-display text-[10px] text-white/40">BULL UP</div>
              <pre className="mt-1 text-white/90 font-mono whitespace-pre-wrap">{`@RingProtocol bull`}</pre>
            </div>
          </div>
          <div className="mt-4 text-white/40 text-xs pix-display leading-relaxed">
            RULES //<br />
            • 1 launch per X account per day<br />
            • 5-minute bull window after launch<br />
            • Follower bonus capped at 50K<br />
            • PvP match activates when 2 tokens launch from same thread within 10 min<br />
            • PvP winner pot auto-buys on migration
          </div>
        </section>

        {/* Claiming */}
        <section className="pix-card pix-card-gold">
          <h2 className="pix-display text-sm ring-gradient">CLAIMING FEES</h2>
          <ol className="mt-3 space-y-2 text-white/70 list-decimal list-inside">
            <li>Go to ring.xyz/claims</li>
            <li>Sign in with X — we match your handle against all vaults</li>
            <li>Connect a Solana wallet</li>
            <li>Claim your SOL</li>
          </ol>
          <p className="mt-3 text-white/50 text-sm">
            Works for launchers, targets, and bulls. Your role determines your share.
          </p>
        </section>

      </div>
    </div>
  );
}
