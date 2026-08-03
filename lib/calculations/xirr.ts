import type { CashFlow } from "@/lib/calculations/types";
import { daysBetween } from "@/lib/calculations/date-utils";

const MAX_NEWTON_ITERATIONS = 100;
const NEWTON_TOLERANCE = 1e-7;
const YEAR_DAYS = 365;

function npv(rate: number, flows: { years: number; amount: number }[]): number {
  return flows.reduce((sum, f) => sum + f.amount / Math.pow(1 + rate, f.years), 0);
}

function npvDerivative(rate: number, flows: { years: number; amount: number }[]): number {
  return flows.reduce((sum, f) => sum - (f.years * f.amount) / Math.pow(1 + rate, f.years + 1), 0);
}

/**
 * Money-weighted annualized return (XIRR) for an irregular series of cash
 * flows. A plain CAGR formula (final/initial)^(1/years)-1 is invalid once
 * there are periodic contributions, so this Newton-Raphson solver (with a
 * bisection fallback) finds the rate that zeroes the net present value of
 * every contribution and the final portfolio value.
 */
export function xirr(cashFlows: CashFlow[], guess = 0.1): number {
  if (cashFlows.length < 2) return 0;

  const t0 = cashFlows[0].date;
  const flows = cashFlows.map((cf) => ({
    years: daysBetween(t0, cf.date) / YEAR_DAYS,
    amount: cf.amount,
  }));

  const hasPositive = flows.some((f) => f.amount > 0);
  const hasNegative = flows.some((f) => f.amount < 0);
  if (!hasPositive || !hasNegative) return 0;

  let rate = guess;
  for (let i = 0; i < MAX_NEWTON_ITERATIONS; i++) {
    const value = npv(rate, flows);
    const derivative = npvDerivative(rate, flows);
    if (Math.abs(derivative) < 1e-10) break;

    const nextRate = rate - value / derivative;
    if (!Number.isFinite(nextRate) || nextRate <= -1) break;

    if (Math.abs(nextRate - rate) < NEWTON_TOLERANCE) return nextRate;
    rate = nextRate;
  }

  if (Number.isFinite(rate) && rate > -1 && Math.abs(npv(rate, flows)) < 1) {
    return rate;
  }

  return bisectionFallback(flows);
}

function bisectionFallback(flows: { years: number; amount: number }[]): number {
  let lo = -0.99;
  let hi = 10;
  let loValue = npv(lo, flows);

  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const midValue = npv(mid, flows);

    if (Math.abs(midValue) < 1e-4 || hi - lo < 1e-9) {
      return mid;
    }

    if (Math.sign(midValue) === Math.sign(loValue)) {
      lo = mid;
      loValue = midValue;
    } else {
      hi = mid;
    }
  }

  return (lo + hi) / 2;
}
