import type { Metadata } from "next";
import { VT323, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShapeGrid } from "@/components/ShapeGrid";
import { CursorEffect } from "@/components/CursorEffect";
import { SolanaProvider } from "@/components/SolanaProvider";

const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--font-vt323" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });

export const metadata: Metadata = {
  title: "RING // launch tokens. fight for fees.",
  description: "Launch tokens on Printr. Compete in PvP ring matches. Winner takes all fees. ringsol.fun",
  icons: { icon: "/icon.svg" },
  metadataBase: new URL("https://ringsol.fun"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${vt323.variable} ${pressStart.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col cursor-none">
        <SolanaProvider>
        <CursorEffect />
        <div className="ring-gradient-bar" />
        <Header />
        <main className="flex-1 relative z-10">
          <ShapeGrid />
          {children}
        </main>
        <Footer />
        </SolanaProvider>
      </body>
    </html>
  );
}
