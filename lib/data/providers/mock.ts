import type { PriceProvider, PriceHistory, PricePoint } from "@/lib/data/types";
import { getEtfMeta, type EtfCategory } from "@/lib/data/etf-list";

/**
 * Stooq/Yahoo's free endpoints aren't reachable server-side (see plan notes),
 * and some tickers (e.g. TD's e-Series mutual funds) aren't carried by any
 * commercial data vendor at all. This provider generates a deterministic,
 * per-ticker geometric random walk so those cases — and local dev with no API
 * key configured — still work. It implements the same PriceProvider interface
 * as a real vendor, and TwelveDataPriceProvider falls back to it per-ticker.
 */

const TRADING_DAYS_PER_YEAR = 252;
const START_PRICE = 50;

const CATEGORY_PARAMS: Record<EtfCategory, { annualDrift: number; annualVol: number }> = {
  "us-broad-equity": { annualDrift: 0.1, annualVol: 0.15 },
  "us-growth": { annualDrift: 0.14, annualVol: 0.22 },
  "us-dividend": { annualDrift: 0.09, annualVol: 0.14 },
  "international-developed": { annualDrift: 0.06, annualVol: 0.16 },
  "emerging-markets": { annualDrift: 0.05, annualVol: 0.2 },
  bonds: { annualDrift: 0.025, annualVol: 0.05 },
  "ca-all-equity": { annualDrift: 0.09, annualVol: 0.15 },
  "ca-growth-allocation": { annualDrift: 0.07, annualVol: 0.11 },
  "ca-balanced-allocation": { annualDrift: 0.055, annualVol: 0.08 },
};

function hashStringToSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
  }
  return hash >>> 0 || 1;
}

/** Mulberry32 PRNG — small, fast, deterministic given a seed. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function nextGaussian(rand: () => number): number {
  const u1 = Math.max(rand(), Number.EPSILON);
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isWeekend(date: Date): boolean {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

function generateMockSeries(ticker: string, launchDate: string, category: EtfCategory): PricePoint[] {
  const rand = mulberry32(hashStringToSeed(ticker));
  const { annualDrift, annualVol } = CATEGORY_PARAMS[category];
  const dailyDrift = annualDrift / TRADING_DAYS_PER_YEAR;
  const dailyVol = annualVol / Math.sqrt(TRADING_DAYS_PER_YEAR);

  const start = new Date(`${launchDate}T00:00:00Z`);
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);

  const points: PricePoint[] = [];
  let price = START_PRICE;
  const cursor = new Date(start);

  while (cursor <= end) {
    if (!isWeekend(cursor)) {
      const z = nextGaussian(rand);
      price *= Math.exp(dailyDrift - 0.5 * dailyVol * dailyVol + dailyVol * z);
      points.push({ date: toIsoDate(cursor), close: Math.round(price * 100) / 100 });
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return points;
}

export class MockPriceProvider implements PriceProvider {
  async getHistory(ticker: string): Promise<PriceHistory> {
    const meta = getEtfMeta(ticker);
    if (!meta) {
      throw new Error(`Unknown ticker: ${ticker}`);
    }
    return { points: generateMockSeries(meta.ticker, meta.launchDate, meta.category), source: "mock" };
  }
}
