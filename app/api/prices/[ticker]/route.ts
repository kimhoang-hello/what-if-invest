import { NextResponse } from "next/server";
import { priceProvider } from "@/lib/data";
import { getEtfMeta } from "@/lib/data/etf-list";
import type { PriceHistory } from "@/lib/data/types";

const CACHE_TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { fetchedAt: number; data: PriceHistory }>();

export async function GET(_request: Request, ctx: RouteContext<"/api/prices/[ticker]">) {
  const { ticker: rawTicker } = await ctx.params;
  const ticker = rawTicker.toUpperCase();

  if (!getEtfMeta(ticker)) {
    return NextResponse.json({ error: `Unknown ticker: ${ticker}` }, { status: 404 });
  }

  const cached = cache.get(ticker);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json({ ticker, prices: cached.data.points, source: cached.data.source });
  }

  try {
    const history = await priceProvider.getHistory(ticker);
    cache.set(ticker, { fetchedAt: Date.now(), data: history });
    return NextResponse.json({ ticker, prices: history.points, source: history.source });
  } catch {
    return NextResponse.json({ error: `Failed to load price history for ${ticker}` }, { status: 502 });
  }
}
