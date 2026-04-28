import { createPrintrClient, buildToken } from "@printr/sdk";

const client = createPrintrClient({
  apiKey: process.env.PRINTR_API_KEY ?? "",
  baseUrl: process.env.PRINTR_API_BASE_URL ?? "https://api-preview.printr.money",
});

export interface LaunchParams {
  name: string;
  ticker: string;
  description?: string;
  imageUrl?: string;
  creatorWallet: string;
  fee?: number;    // bonding curve fee % (e.g. 0.4)
  ammfee?: number; // post-grad fee % (e.g. 1.4)
}

export interface LaunchResult {
  tokenId: string;
  mint: string | null;
  tradeUrl: string | null;
  error: string | null;
}

export async function launchToken(params: LaunchParams): Promise<LaunchResult> {
  try {
    const result = await buildToken({
      creator_accounts: [`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${params.creatorWallet}`],
      name: params.name,
      symbol: params.ticker,
      description: params.description || `${params.name} — launched via RING protocol`,
      chains: ["solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"],
      image: params.imageUrl,
      fee_sink: "dev",
      custom_fees: {
        bonding_curve_dev_fee_bps: Math.round((params.fee ?? 0.4) * 100),
        amm_dev_fee_bps: Math.round((params.ammfee ?? 1.4) * 100),
      },
      initial_buy: { spend_usd: 0 },
    }, client);

    if (result.isErr()) {
      return { tokenId: "", mint: null, tradeUrl: null, error: String(result.error) };
    }

    const data = result.value;
    return {
      tokenId: data.token_id ?? "",
      mint: (data as any).mint ?? null,
      tradeUrl: (data as any).trade_url ?? null,
      error: null,
    };
  } catch (e) {
    return { tokenId: "", mint: null, tradeUrl: null, error: String(e) };
  }
}

export async function getToken(tokenIdOrAddress: string) {
  try {
    const { GET } = client as any;
    if (GET) {
      const res = await GET("/v1/tokens/{id}", { params: { path: { id: tokenIdOrAddress } } });
      return res.data ?? null;
    }
    return null;
  } catch { return null; }
}

export { client as printrClient };
