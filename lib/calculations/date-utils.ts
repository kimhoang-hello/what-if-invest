import type { PricePoint } from "@/lib/data/types";

export function parseIso(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00Z`);
}

export function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(dateStr: string, days: number): string {
  const d = parseIso(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return toIso(d);
}

export function addYears(dateStr: string, years: number): string {
  return addMonthsClamped(dateStr, years * 12);
}

/** Adds months, clamping the day to the last day of the target month (e.g. Jan 31 + 1mo -> Feb 28/29). */
export function addMonthsClamped(dateStr: string, months: number): string {
  const d = parseIso(dateStr);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const lastDayOfTargetMonth = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, lastDayOfTargetMonth));
  return toIso(d);
}

export function daysBetween(fromIso: string, toIsoStr: string): number {
  const ms = parseIso(toIsoStr).getTime() - parseIso(fromIso).getTime();
  return ms / (1000 * 60 * 60 * 24);
}

/**
 * Finds the price on the given date, or the most recent available price
 * before it (standard "as of" lookup for a non-trading day). Assumes prices
 * is sorted ascending by date. Returns undefined if targetDate is before the
 * first available price.
 */
export function findPriceOnOrBefore(prices: PricePoint[], targetDate: string): PricePoint | undefined {
  if (prices.length === 0 || targetDate < prices[0].date) return undefined;

  let lo = 0;
  let hi = prices.length - 1;
  let result: PricePoint | undefined;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (prices[mid].date <= targetDate) {
      result = prices[mid];
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return result;
}
