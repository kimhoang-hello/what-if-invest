import type { SimulationPoint } from "@/lib/calculations/types";

export interface MergedPoint {
  date: string;
  a: SimulationPoint | null;
  b: SimulationPoint | null;
}

/**
 * Merges two simulation series by date (sorted union), forward-filling
 * whichever side has no entry for a given date. Real vendors can have
 * mismatched trading calendars (e.g. a US-listed vs. a TSX-listed ETF), so
 * charts shouldn't assume the two series line up index-for-index.
 */
export function mergeSeriesByDate(seriesA: SimulationPoint[], seriesB: SimulationPoint[]): MergedPoint[] {
  const map = new Map<string, MergedPoint>();

  for (const p of seriesA) map.set(p.date, { date: p.date, a: p, b: null });
  for (const p of seriesB) {
    const existing = map.get(p.date);
    if (existing) existing.b = p;
    else map.set(p.date, { date: p.date, a: null, b: p });
  }

  const merged = Array.from(map.values()).sort((x, y) => (x.date < y.date ? -1 : 1));

  let lastA: SimulationPoint | null = null;
  let lastB: SimulationPoint | null = null;
  for (const point of merged) {
    if (point.a) lastA = point.a;
    else point.a = lastA;
    if (point.b) lastB = point.b;
    else point.b = lastB;
  }

  return merged;
}
