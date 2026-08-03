import { describe, it, expect } from "vitest";
import { xirr } from "@/lib/calculations/xirr";

describe("xirr", () => {
  it("computes ~10% for a simple single-period investment", () => {
    // Invest $1000, get back $1100 exactly one year later -> 10% annualized.
    const rate = xirr([
      { date: "2023-01-01", amount: -1000 },
      { date: "2024-01-01", amount: 1100 },
    ]);
    expect(rate).toBeCloseTo(0.1, 2);
  });

  it("computes 0% for a flat investment (no gain or loss)", () => {
    const rate = xirr([
      { date: "2023-01-01", amount: -1000 },
      { date: "2024-01-01", amount: 1000 },
    ]);
    expect(rate).toBeCloseTo(0, 2);
  });

  it("handles multiple contributions with a known doubling", () => {
    // $1000/yr for 3 years (3000 total), doubles to 6000 right after the last contribution.
    const rate = xirr([
      { date: "2020-01-01", amount: -1000 },
      { date: "2021-01-01", amount: -1000 },
      { date: "2022-01-01", amount: -1000 },
      { date: "2022-01-01", amount: 6000 },
    ]);
    expect(rate).toBeGreaterThan(0);
    expect(Number.isFinite(rate)).toBe(true);
  });

  it("returns 0 when cash flows are all the same sign", () => {
    const rate = xirr([
      { date: "2023-01-01", amount: 1000 },
      { date: "2024-01-01", amount: 500 },
    ]);
    expect(rate).toBe(0);
  });
});
