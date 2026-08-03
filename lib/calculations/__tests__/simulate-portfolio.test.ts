import { describe, it, expect } from "vitest";
import { simulatePortfolio } from "@/lib/calculations/simulate-portfolio";
import type { PricePoint } from "@/lib/data/types";

describe("simulatePortfolio", () => {
  it("simulates a lump-sum-only investment with a changing price", () => {
    const prices: PricePoint[] = [
      { date: "2024-01-01", close: 10 },
      { date: "2024-01-31", close: 12 },
    ];

    const result = simulatePortfolio({
      prices,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      initialInvestment: 1000,
      contributionAmount: 0,
      frequency: "none",
    });

    expect(result.totalShares).toBeCloseTo(100, 6);
    expect(result.totalContributed).toBe(1000);
    expect(result.finalValue).toBeCloseTo(1200, 6);
  });

  it("accumulates monthly DCA contributions at a constant price", () => {
    const prices: PricePoint[] = [
      { date: "2024-01-01", close: 10 },
      { date: "2024-02-01", close: 10 },
      { date: "2024-03-01", close: 10 },
      { date: "2024-04-01", close: 10 },
    ];

    const result = simulatePortfolio({
      prices,
      startDate: "2024-01-01",
      endDate: "2024-04-01",
      initialInvestment: 1000,
      contributionAmount: 100,
      frequency: "monthly",
    });

    // initial 1000 + 3 recurring contributions of 100 (Feb, Mar, Apr)
    expect(result.totalContributed).toBe(1300);
    expect(result.totalShares).toBeCloseTo(130, 6);
    expect(result.finalValue).toBeCloseTo(1300, 6);
  });

  it("snaps a contribution date with no exact price to the prior available trading day", () => {
    const prices: PricePoint[] = [
      { date: "2024-01-01", close: 10 },
      { date: "2024-01-12", close: 11 },
      { date: "2024-01-19", close: 12 },
    ];

    // biweekly (14 days) from 2024-01-01 lands on 2024-01-15, which has no
    // price entry -> should snap to 2024-01-12's close of 11.
    const result = simulatePortfolio({
      prices,
      startDate: "2024-01-01",
      endDate: "2024-01-19",
      initialInvestment: 1000,
      contributionAmount: 100,
      frequency: "biweekly",
    });

    const expectedShares = 1000 / 10 + 100 / 11;
    expect(result.totalShares).toBeCloseTo(expectedShares, 6);
    expect(result.totalContributed).toBe(1100);
    expect(result.finalValue).toBeCloseTo(expectedShares * 12, 6);

    const purchaseDates = result.series.filter((p, i, arr) => i === 0 || p.totalContributed !== arr[i - 1].totalContributed).map((p) => p.date);
    expect(purchaseDates).toEqual(["2024-01-01", "2024-01-12"]);
  });
});
