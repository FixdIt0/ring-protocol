import { NextResponse } from "next/server";
import { RingTwitterClient } from "@/lib/twitter";
import { RingBot } from "@/lib/bot";

let bot: RingBot | null = null;

export async function POST() {
  if (bot) return NextResponse.json({ status: "already running" });

  const twitter = new RingTwitterClient({
    apiKey: process.env.X_API_KEY,
    apiSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
    dryRun: !process.env.X_API_KEY,
  });

  bot = new RingBot(twitter);
  bot.start(); // fire-and-forget
  return NextResponse.json({ status: "started" });
}

export async function DELETE() {
  if (bot) { bot.stop(); bot = null; }
  return NextResponse.json({ status: "stopped" });
}
