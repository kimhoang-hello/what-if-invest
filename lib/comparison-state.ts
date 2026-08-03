import type { ContributionFrequency, InvestmentPeriod } from "@/lib/calculations/types";
import { getEtfMeta } from "@/lib/data/etf-list";

export interface ComparisonInputs {
  etfA: string;
  etfB: string;
  initialInvestment: number;
  contributionAmount: number;
  frequency: ContributionFrequency;
  period: InvestmentPeriod;
  annualIncreasePct: number;
}

export const DEFAULT_INPUTS: ComparisonInputs = {
  etfA: "VOO",
  etfB: "XEQT",
  initialInvestment: 10000,
  contributionAmount: 500,
  frequency: "monthly",
  period: "10y",
  annualIncreasePct: 0,
};

const FREQUENCIES: ContributionFrequency[] = ["daily", "weekly", "biweekly", "monthly", "quarterly", "yearly", "none"];
const PERIODS: InvestmentPeriod[] = ["1y", "3y", "5y", "10y", "15y", "20y", "max"];

export function inputsToSearchParams(inputs: ComparisonInputs): URLSearchParams {
  const params = new URLSearchParams();
  params.set("etfA", inputs.etfA);
  params.set("etfB", inputs.etfB);
  params.set("initial", String(inputs.initialInvestment));
  params.set("contribution", String(inputs.contributionAmount));
  params.set("freq", inputs.frequency);
  params.set("period", inputs.period);
  if (inputs.annualIncreasePct > 0) {
    params.set("increase", String(inputs.annualIncreasePct));
  }
  return params;
}

export function searchParamsToInputs(params: URLSearchParams): ComparisonInputs {
  const etfA = params.get("etfA");
  const etfB = params.get("etfB");
  const initialRaw = params.get("initial");
  const contributionRaw = params.get("contribution");
  const freq = params.get("freq") as ContributionFrequency | null;
  const period = params.get("period") as InvestmentPeriod | null;
  const increaseRaw = params.get("increase");

  const initial = initialRaw === null ? NaN : Number(initialRaw);
  const contribution = contributionRaw === null ? NaN : Number(contributionRaw);
  const increase = increaseRaw === null ? NaN : Number(increaseRaw);

  return {
    etfA: etfA && getEtfMeta(etfA)?.assetType === "etf" ? etfA : DEFAULT_INPUTS.etfA,
    etfB: etfB && getEtfMeta(etfB) ? etfB : DEFAULT_INPUTS.etfB,
    initialInvestment: Number.isFinite(initial) && initial > 0 ? initial : DEFAULT_INPUTS.initialInvestment,
    contributionAmount: Number.isFinite(contribution) && contribution >= 0 ? contribution : DEFAULT_INPUTS.contributionAmount,
    frequency: freq && FREQUENCIES.includes(freq) ? freq : DEFAULT_INPUTS.frequency,
    period: period && PERIODS.includes(period) ? period : DEFAULT_INPUTS.period,
    annualIncreasePct: Number.isFinite(increase) && increase > 0 ? increase : DEFAULT_INPUTS.annualIncreasePct,
  };
}
