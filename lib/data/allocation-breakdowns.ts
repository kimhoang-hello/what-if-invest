export interface AllocationBreakdown {
  ticker: string;
  /** Percentages should sum to ~100 */
  canadianEquityPct: number;
  usEquityPct: number;
  internationalEquityPct: number;
  emergingMarketsPct: number;
  fixedIncomePct: number;
  /** Annual Management Expense Ratio, in percent */
  merPct: number;
  /** Where a user can look up the fund's current, authoritative figures */
  researchUrl: string;
}

/**
 * Approximate target allocations and MERs for the Canadian all-in-one
 * asset-allocation funds in this app, based on each issuer's published
 * equity/bond split, regional weights, and fee (iShares Core ETF Portfolios,
 * Vanguard Asset Allocation ETFs, TD e-Series fact sheet, mid-2026). These
 * are long-term target policies, not daily holdings, and MERs do change —
 * treat this as a rough picture; researchUrl links to a source to verify
 * current figures. Only funds that are themselves a mix of asset classes are
 * listed here; a single-asset-class fund like VOO or BND doesn't have an
 * interesting breakdown to show.
 */
export const ALLOCATION_BREAKDOWNS: Record<string, AllocationBreakdown> = {
  XEQT: {
    ticker: "XEQT",
    canadianEquityPct: 26,
    usEquityPct: 44,
    internationalEquityPct: 25,
    emergingMarketsPct: 5,
    fixedIncomePct: 0,
    merPct: 0.2,
    researchUrl: "https://www.blackrock.com/ca/investors/en/products/309480/ishares-core-equity-etf-portfolio",
  },
  // Vanguard Canada's site (vanguard.ca) currently rejects automated access
  // outright (503s), so its own fund pages couldn't be verified as working —
  // linking to a third-party quote page instead of risking a dead "official" link.
  VEQT: {
    ticker: "VEQT",
    canadianEquityPct: 30,
    usEquityPct: 42,
    internationalEquityPct: 20,
    emergingMarketsPct: 8,
    fixedIncomePct: 0,
    merPct: 0.24,
    researchUrl: "https://stockanalysis.com/quote/tsx/VEQT/",
  },
  XGRO: {
    ticker: "XGRO",
    canadianEquityPct: 20,
    usEquityPct: 37,
    internationalEquityPct: 20,
    emergingMarketsPct: 4,
    fixedIncomePct: 19,
    merPct: 0.2,
    researchUrl: "https://www.blackrock.com/ca/investors/en/products/239447/ishares-balanced-growth-coreportfoliotm-fund",
  },
  VGRO: {
    ticker: "VGRO",
    canadianEquityPct: 24,
    usEquityPct: 34,
    internationalEquityPct: 16,
    emergingMarketsPct: 6,
    fixedIncomePct: 20,
    merPct: 0.24,
    researchUrl: "https://stockanalysis.com/quote/tsx/VGRO/",
  },
  XBAL: {
    ticker: "XBAL",
    canadianEquityPct: 16,
    usEquityPct: 26,
    internationalEquityPct: 15,
    emergingMarketsPct: 3,
    fixedIncomePct: 40,
    merPct: 0.17,
    researchUrl: "https://www.blackrock.com/ca/investors/en/products/239449/ishares-balanced-income-coreportfoliotm-fund",
  },
  VBAL: {
    ticker: "VBAL",
    canadianEquityPct: 18,
    usEquityPct: 25,
    internationalEquityPct: 12,
    emergingMarketsPct: 5,
    fixedIncomePct: 40,
    merPct: 0.24,
    researchUrl: "https://stockanalysis.com/quote/tsx/VBAL/",
  },
  TDB900: {
    ticker: "TDB900",
    canadianEquityPct: 100,
    usEquityPct: 0,
    internationalEquityPct: 0,
    emergingMarketsPct: 0,
    fixedIncomePct: 0,
    merPct: 0.22,
    researchUrl:
      "https://www.td.com/ca/en/asset-management/funds/solutions/mutual-funds/fundcard?fundId=3261&fundname=TD-Canadian-Index-Fund---e%2F",
  },
};

export function getAllocationBreakdown(ticker: string): AllocationBreakdown | undefined {
  return ALLOCATION_BREAKDOWNS[ticker.toUpperCase()];
}
