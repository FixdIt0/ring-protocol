import type { Metadata } from "next";
import { VT323, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShapeGrid } from "@/components/ShapeGrid";
import { CursorEffect } from "@/components/CursorEffect";

const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--font-vt323" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });

export const metadata: Metadata = {
  title: "RING // competitive token launches",
  description: "Launch tokens on Printr. Compete in PvP ring matches. Winner takes all fees.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${vt323.variable} ${pressStart.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col cursor-none">
        <CursorEffect />
        <div className="ring-gradient-bar" />
        <Header />
        <main className="flex-1 relative z-10">
          <ShapeGrid />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
