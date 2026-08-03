import type { ContributionFrequency, InvestmentPeriod, ReturnMetrics } from "@/lib/calculations/types";
import { FREQUENCY_SUFFIX, PERIOD_SENTENCE_LABELS } from "@/lib/calculations/labels";
import { formatCurrency } from "@/lib/format";

export interface ComparisonResult {
  winnerTicker: string;
  loserTicker: string;
  diffValue: number;
  diffReturnPct: number;
  diffCagr: number;
  summary: string;
}

export interface CompareOptions {
  tickerA: string;
  metricsA: ReturnMetrics;
  tickerB: string;
  metricsB: ReturnMetrics;
  contributionAmount: number;
  frequency: ContributionFrequency;
  period: InvestmentPeriod;
}

export function compareResults(opts: CompareOptions): ComparisonResult {
  const { tickerA, metricsA, tickerB, metricsB, contributionAmount, frequency, period } = opts;

  const aWins = metricsA.finalValue >= metricsB.finalValue;
  const winnerTicker = aWins ? tickerA : tickerB;
  const loserTicker = aWins ? tickerB : tickerA;
  const winnerMetrics = aWins ? metricsA : metricsB;
  const loserMetrics = aWins ? metricsB : metricsA;

  const diffValue = winnerMetrics.finalValue - loserMetrics.finalValue;
  const diffReturnPct = winnerMetrics.totalReturnPct - loserMetrics.totalReturnPct;
  const diffCagr = winnerMetrics.cagr - loserMetrics.cagr;

  const contributionPhrase =
    frequency === "none"
      ? `${formatCurrency(contributionAmount)} as a lump sum`
      : `${formatCurrency(contributionAmount)}${FREQUENCY_SUFFIX[frequency]}`;

  const summary = `If you invested ${contributionPhrase} into ${winnerTicker} instead of ${loserTicker} over ${PERIOD_SENTENCE_LABELS[period]}, your portfolio would have grown approximately ${formatCurrency(diffValue)} more.`;

  return { winnerTicker, loserTicker, diffValue, diffReturnPct, diffCagr, summary };
}
