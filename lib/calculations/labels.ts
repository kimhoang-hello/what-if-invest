import type { ContributionFrequency, InvestmentPeriod } from "@/lib/calculations/types";

export const FREQUENCY_LABELS: Record<ContributionFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
  none: "No recurring contribution",
};

export const FREQUENCY_SUFFIX: Record<ContributionFrequency, string> = {
  daily: "/day",
  weekly: "/week",
  biweekly: "/2 weeks",
  monthly: "/month",
  quarterly: "/quarter",
  yearly: "/year",
  none: "",
};

export const PERIOD_LABELS: Record<InvestmentPeriod, string> = {
  "1y": "1 Year",
  "3y": "3 Years",
  "5y": "5 Years",
  "10y": "10 Years",
  "15y": "15 Years",
  "20y": "20 Years",
  max: "Maximum available period",
};

export const PERIOD_SENTENCE_LABELS: Record<InvestmentPeriod, string> = {
  "1y": "the last year",
  "3y": "the last 3 years",
  "5y": "the last 5 years",
  "10y": "the last 10 years",
  "15y": "the last 15 years",
  "20y": "the last 20 years",
  max: "the full available period",
};
