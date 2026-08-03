import type { PricePoint } from "@/lib/data/types";
import type { ContributionFrequency, SimulationResult } from "@/lib/calculations/types";
import { findPriceOnOrBefore, daysBetween } from "@/lib/calculations/date-utils";
import { generateContributionSchedule } from "@/lib/calculations/contribution-schedule";

export interface SimulationInput {
  prices: PricePoint[];
  startDate: string;
  endDate: string;
  initialInvestment: number;
  contributionAmount: number;
  frequency: ContributionFrequency;
  /** Optional annual increase applied to the recurring contribution amount, compounding each full year since start. */
  annualIncreasePct?: number;
}

interface RawEvent {
  date: string;
  amount: number;
}

/**
 * Simulates a dollar-cost-averaging strategy: an initial lump sum plus
 * (optionally) recurring contributions, each buying fractional shares at
 * that day's closing price (snapped to the most recent trading day for
 * non-trading dates).
 */
export function simulatePortfolio(input: SimulationInput): SimulationResult {
  const { prices, startDate, endDate, initialInvestment, contributionAmount, frequency, annualIncreasePct = 0 } = input;

  const rawEvents: RawEvent[] = [{ date: startDate, amount: initialInvestment }];

  const recurringDates = generateContributionSchedule(startDate, endDate, frequency);
  for (const date of recurringDates) {
    const yearsElapsed = Math.floor(daysBetween(startDate, date) / 365);
    const amount = contributionAmount * Math.pow(1 + annualIncreasePct / 100, yearsElapsed);
    rawEvents.push({ date, amount });
  }

  const purchases = new Map<string, { amount: number; shares: number }>();
  for (const event of rawEvents) {
    const price = findPriceOnOrBefore(prices, event.date);
    if (!price) continue;

    const shares = event.amount / price.close;
    const existing = purchases.get(price.date);
    if (existing) {
      existing.amount += event.amount;
      existing.shares += shares;
    } else {
      purchases.set(price.date, { amount: event.amount, shares });
    }
  }

  const effectiveStart = findPriceOnOrBefore(prices, startDate)?.date ?? prices[0]?.date;
  const effectiveEnd = findPriceOnOrBefore(prices, endDate)?.date ?? prices[prices.length - 1]?.date;

  if (!effectiveStart || !effectiveEnd) {
    throw new Error("No price data available in the requested range");
  }

  const pricesInRange = prices.filter((p) => p.date >= effectiveStart && p.date <= effectiveEnd);

  const series: SimulationResult["series"] = [];
  let runningShares = 0;
  let runningContributed = 0;

  for (const point of pricesInRange) {
    const purchase = purchases.get(point.date);
    if (purchase) {
      runningShares += purchase.shares;
      runningContributed += purchase.amount;
    }
    series.push({
      date: point.date,
      value: runningShares * point.close,
      sharesOwned: runningShares,
      totalContributed: runningContributed,
    });
  }

  const last = series[series.length - 1];
  const finalValue = last?.value ?? 0;
  const totalContributed = last?.totalContributed ?? 0;
  const totalShares = last?.sharesOwned ?? 0;

  const cashFlows = [
    ...Array.from(purchases.entries()).map(([date, p]) => ({ date, amount: -p.amount })),
    { date: effectiveEnd, amount: finalValue },
  ];

  return {
    series,
    finalValue,
    totalContributed,
    totalShares,
    cashFlows,
    startDate: effectiveStart,
    endDate: effectiveEnd,
  };
}
