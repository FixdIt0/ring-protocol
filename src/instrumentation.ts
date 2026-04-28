export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initDb } = await import("@/lib/db");
    await initDb();

    const { RingTwitterClient } = await import("@/lib/twitter");
    const { RingBot } = await import("@/lib/bot");

    const twitter = new RingTwitterClient({
      apiKey: process.env.X_API_KEY,
      apiSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
      dryRun: !process.env.X_API_KEY,
    });

    const bot = new RingBot(twitter);
    bot.start();
  }
}
