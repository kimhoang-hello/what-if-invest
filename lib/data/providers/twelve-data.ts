import type { PriceProvider, PriceHistory, PricePoint } from "@/lib/data/types";
import { getEtfMeta } from "@/lib/data/etf-list";
import { MockPriceProvider } from "@/lib/data/providers/mock";

const API_BASE = "https://api.twelvedata.com/time_series";
const MAX_OUTPUT_SIZE = 5000;
// Our oldest fund (FCNTX, 1967) needs ~15,000 trading days; this leaves headroom.
const MAX_PAGES = 6;

interface TwelveDataValue {
  datetime: string;
  close: string;
}

interface TwelveDataResponse {
  status: "ok" | "error";
  values?: TwelveDataValue[];
  message?: string;
}

/**
 * Real price data via Twelve Data (twelvedata.com), chosen because its free
 * tier covers both US exchanges and the Toronto Stock Exchange in one
 * provider — this app mixes US ETFs with Canadian all-in-one ETFs (XEQT,
 * VEQT, etc.). Some tickers (e.g. TD's e-Series mutual funds) aren't carried
 * by any commercial data vendor, so a per-ticker failure falls back to the
 * mock generator rather than breaking the whole comparison.
 */
export class TwelveDataPriceProvider implements PriceProvider {
  private fallback = new MockPriceProvider();

  constructor(private apiKey: string) {}

  async getHistory(ticker: string): Promise<PriceHistory> {
    const meta = getEtfMeta(ticker);
    if (!meta) throw new Error(`Unknown ticker: ${ticker}`);

    try {
      const points = await this.fetchAllPages(meta.ticker, meta.exchange);
      if (points.length === 0) throw new Error("no data returned");
      return { points, source: "real" };
    } catch (err) {
      console.warn(`[twelve-data] falling back to mock data for ${ticker}: ${(err as Error).message}`);
      return this.fallback.getHistory(ticker);
    }
  }

  private async fetchAllPages(ticker: string, exchange?: string): Promise<PricePoint[]> {
    const byDate = new Map<string, number>();
    let endDate: string | undefined;

    for (let page = 0; page < MAX_PAGES; page++) {
      const params = new URLSearchParams({
        symbol: ticker,
        interval: "1day",
        outputsize: String(MAX_OUTPUT_SIZE),
        adjust: "all",
        apikey: this.apiKey,
      });
      if (exchange) params.set("exchange", exchange);
      if (endDate) params.set("end_date", endDate);

      const res = await fetch(`${API_BASE}?${params.toString()}`);
      const data: TwelveDataResponse = await res.json();

      if (data.status !== "ok" || !data.values?.length) {
        if (page === 0) throw new Error(data.message ?? `HTTP ${res.status}`);
        break;
      }

      let oldestInPage: string | undefined;
      for (const v of data.values) {
        byDate.set(v.datetime, Number(v.close));
        if (!oldestInPage || v.datetime < oldestInPage) oldestInPage = v.datetime;
      }

      // Fewer rows than requested means we've reached the earliest available data.
      if (data.values.length < MAX_OUTPUT_SIZE || !oldestInPage) break;

      endDate = addDays(oldestInPage, -1);
    }

    return Array.from(byDate.entries())
      .map(([date, close]) => ({ date, close }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  }
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
