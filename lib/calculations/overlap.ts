import type { PricePoint } from "@/lib/data/types";
import type { DateRangeResolution, InvestmentPeriod } from "@/lib/calculations/types";
import { addYears } from "@/lib/calculations/date-utils";
import { getEtfMeta } from "@/lib/data/etf-list";

const PERIOD_YEARS: Partial<Record<InvestmentPeriod, number>> = {
  "1y": 1,
  "3y": 3,
  "5y": 5,
  "10y": 10,
  "15y": 15,
  "20y": 20,
};

/**
 * Resolves the actual [startDate, endDate] to simulate over, clamping to the
 * overlap of both ETFs' available history when the requested period is
 * longer than one (or both) ETF's history.
 */
export function resolveDateRange(
  period: InvestmentPeriod,
  tickerA: string,
  pricesA: PricePoint[],
  tickerB: string,
  pricesB: PricePoint[]
): DateRangeResolution {
  const firstA = pricesA[0]?.date;
  const firstB = pricesB[0]?.date;
  const lastA = pricesA[pricesA.length - 1]?.date;
  const lastB = pricesB[pricesB.length - 1]?.date;

  if (!firstA || !firstB || !lastA || !lastB) {
    throw new Error("Cannot resolve date range: missing price data");
  }

  const endDate = lastA < lastB ? lastA : lastB;
  const overlapStart = firstA > firstB ? firstA : firstB;

  const years = PERIOD_YEARS[period];
  const desiredStart = years ? addYears(endDate, -years) : overlapStart;
  const actualStart = desiredStart > overlapStart ? desiredStart : overlapStart;

  const clamped = years ? actualStart > desiredStart : false;

  let message: string | undefined;
  if (clamped) {
    const limitingTicker = firstA > firstB ? tickerA : tickerB;
    const limitingName = getEtfMeta(limitingTicker)?.name ?? limitingTicker;
    message = `Data limited to ${actualStart} onward because ${limitingTicker} (${limitingName}) doesn't have history before then.`;
  }

  return { startDate: actualStart, endDate, clamped, message };
}
