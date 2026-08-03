import type { PricePoint } from "@/lib/data/types";

export type ContributionFrequency =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "none";

export type InvestmentPeriod = "1y" | "3y" | "5y" | "10y" | "15y" | "20y" | "max";

export interface CashFlow {
  date: string;
  /** Negative = money going into the investment, positive = value received back */
  amount: number;
}

export interface SimulationPoint {
  date: string;
  value: number;
  sharesOwned: number;
  totalContributed: number;
}

export interface SimulationResult {
  series: SimulationPoint[];
  finalValue: number;
  totalContributed: number;
  totalShares: number;
  cashFlows: CashFlow[];
  startDate: string;
  endDate: string;
}

export interface ReturnMetrics {
  finalValue: number;
  totalContributions: number;
  gain: number;
  totalReturnPct: number;
  cagr: number;
  growthMultiple: number;
  totalShares: number;
}

export interface DateRangeResolution {
  startDate: string;
  endDate: string;
  clamped: boolean;
  message?: string;
}

export type { PricePoint };
