import { NextResponse } from "next/server";
import { priceProvider } from "@/lib/data";
import { getEtfMeta } from "@/lib/data/etf-list";
import type { PricePoint } from "@/lib/data/types";

const CACHE_TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { fetchedAt: number; data: PricePoint[] }>();

export async function GET(_request: Request, ctx: RouteContext<"/api/prices/[ticker]">) {
  const { ticker: rawTicker } = await ctx.params;
  const ticker = rawTicker.toUpperCase();

  if (!getEtfMeta(ticker)) {
    return NextResponse.json({ error: `Unknown ticker: ${ticker}` }, { status: 404 });
  }

  const cached = cache.get(ticker);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json({ ticker, prices: cached.data });
  }

  try {
    const prices = await priceProvider.getHistory(ticker);
    cache.set(ticker, { fetchedAt: Date.now(), data: prices });
    return NextResponse.json({ ticker, prices });
  } catch {
    return NextResponse.json({ error: `Failed to load price history for ${ticker}` }, { status: 502 });
  }
}
