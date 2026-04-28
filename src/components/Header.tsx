"use client";
import Link from "next/link";
import { RingLogo } from "./RingLogo";

export function Header() {
  return (
    <header className="relative z-20 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 group">
        <RingLogo size={48} className="group-hover:scale-110 transition-transform" />
        <span className="pix-display text-2xl sm:text-3xl ring-gradient">RING</span>
      </Link>
      <nav className="flex items-center gap-3 sm:gap-5 pix-display text-[10px]">
        <Link href="/launch" className="pix-link hidden sm:inline">LAUNCH</Link>
        <Link href="/arena" className="pix-link hidden sm:inline">ARENA</Link>
        <Link href="/tokens" className="pix-link hidden sm:inline">TOKENS</Link>
        <Link href="/claims" className="pix-link hidden sm:inline">CLAIMS</Link>
        <Link href="/leaderboard" className="pix-link hidden sm:inline">RANKS</Link>
        <Link href="/docs" className="pix-link hidden sm:inline">DOCS</Link>
        <a
          href="https://x.com/RingProtocol"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on X"
          className="w-10 h-10 flex items-center justify-center border-2 border-white text-white hover:text-black hover:bg-white transition-colors"
        >
          <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </nav>
    </header>
  );
}
