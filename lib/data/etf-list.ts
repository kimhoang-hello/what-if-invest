export type EtfCategory =
  | "ca-equity"
  | "us-equity"
  | "international-equity"
  | "emerging-markets"
  | "bonds"
  | "dividend"
  | "ca-all-equity"
  | "ca-growth-allocation"
  | "ca-balanced-allocation";

export type AssetType = "etf" | "mutual-fund";

export interface EtfMeta {
  ticker: string;
  name: string;
  category: EtfCategory;
  assetType: AssetType;
  /** Approximate real-world inception date, used to size the mock history and demo overlap-clamping */
  launchDate: string;
}

// Canadian-listed ETFs and mutual funds only.
export const ETF_LIST: EtfMeta[] = [
  // Broad Canadian equity
  { ticker: "XIC", name: "iShares Core S&P/TSX Capped Composite Index ETF", category: "ca-equity", assetType: "etf", launchDate: "2001-02-14" },
  { ticker: "VCN", name: "Vanguard FTSE Canada All Cap Index ETF", category: "ca-equity", assetType: "etf", launchDate: "2013-08-02" },
  { ticker: "ZCN", name: "BMO S&P/TSX Capped Composite Index ETF", category: "ca-equity", assetType: "etf", launchDate: "2009-05-29" },

  // US equity, CAD-listed and unhedged
  { ticker: "VFV", name: "Vanguard S&P 500 Index ETF", category: "us-equity", assetType: "etf", launchDate: "2012-11-02" },
  { ticker: "XUU", name: "iShares Core S&P U.S. Total Market Index ETF", category: "us-equity", assetType: "etf", launchDate: "2015-05-21" },
  { ticker: "ZSP", name: "BMO S&P 500 Index ETF", category: "us-equity", assetType: "etf", launchDate: "2012-11-14" },

  // International developed markets
  { ticker: "XEF", name: "iShares Core MSCI EAFE IMI Index ETF", category: "international-equity", assetType: "etf", launchDate: "2013-06-20" },
  { ticker: "VIU", name: "Vanguard FTSE Developed All Cap ex North America Index ETF", category: "international-equity", assetType: "etf", launchDate: "2015-02-04" },

  // Emerging markets
  { ticker: "VEE", name: "Vanguard FTSE Emerging Markets All Cap Index ETF", category: "emerging-markets", assetType: "etf", launchDate: "2011-09-21" },
  { ticker: "XEC", name: "iShares Core MSCI Emerging Markets IMI Index ETF", category: "emerging-markets", assetType: "etf", launchDate: "2013-06-20" },

  // Bonds
  { ticker: "XBB", name: "iShares Core Canadian Universe Bond Index ETF", category: "bonds", assetType: "etf", launchDate: "2000-11-16" },
  { ticker: "VAB", name: "Vanguard Canadian Aggregate Bond Index ETF", category: "bonds", assetType: "etf", launchDate: "2011-11-30" },
  { ticker: "ZAG", name: "BMO Aggregate Bond Index ETF", category: "bonds", assetType: "etf", launchDate: "2010-01-21" },

  // Dividend-focused
  { ticker: "XDIV", name: "iShares Core MSCI Canadian Quality Dividend Index ETF", category: "dividend", assetType: "etf", launchDate: "2017-11-08" },
  { ticker: "VDY", name: "Vanguard FTSE Canadian High Dividend Yield Index ETF", category: "dividend", assetType: "etf", launchDate: "2012-11-02" },
  { ticker: "ZDV", name: "BMO Canadian Dividend ETF", category: "dividend", assetType: "etf", launchDate: "2011-11-08" },

  // All-in-one asset-allocation ETFs — 100% equity
  { ticker: "XEQT", name: "iShares Core Equity ETF Portfolio", category: "ca-all-equity", assetType: "etf", launchDate: "2019-08-07" },
  { ticker: "VEQT", name: "Vanguard All-Equity ETF Portfolio", category: "ca-all-equity", assetType: "etf", launchDate: "2019-01-29" },
  { ticker: "ZEQT", name: "BMO All-Equity ETF", category: "ca-all-equity", assetType: "etf", launchDate: "2021-07-21" },

  // All-in-one asset-allocation ETFs — ~80/20 growth
  { ticker: "XGRO", name: "iShares Core Growth ETF Portfolio", category: "ca-growth-allocation", assetType: "etf", launchDate: "2018-01-25" },
  { ticker: "VGRO", name: "Vanguard Growth ETF Portfolio", category: "ca-growth-allocation", assetType: "etf", launchDate: "2018-01-25" },
  { ticker: "ZGRO", name: "BMO Growth ETF", category: "ca-growth-allocation", assetType: "etf", launchDate: "2019-01-16" },

  // All-in-one asset-allocation ETFs — ~60/40 balanced
  { ticker: "XBAL", name: "iShares Core Balanced ETF Portfolio", category: "ca-balanced-allocation", assetType: "etf", launchDate: "2018-01-25" },
  { ticker: "VBAL", name: "Vanguard Balanced ETF Portfolio", category: "ca-balanced-allocation", assetType: "etf", launchDate: "2018-01-25" },
  { ticker: "ZBAL", name: "BMO Balanced ETF", category: "ca-balanced-allocation", assetType: "etf", launchDate: "2019-01-16" },

  // TD e-Series index mutual funds — selectable only for ETF/Mutual Fund #2,
  // so a beginner can compare a low-cost ETF against the equivalent mutual
  // fund share class most Canadians can buy directly through their bank.
  { ticker: "TDB900", name: "TD Canadian Index Fund - e-Series", category: "ca-equity", assetType: "mutual-fund", launchDate: "1999-11-26" },
  { ticker: "TDB902", name: "TD U.S. Index Fund - e-Series", category: "us-equity", assetType: "mutual-fund", launchDate: "2000-02-16" },
  { ticker: "TDB909", name: "TD International Index Fund - e-Series", category: "international-equity", assetType: "mutual-fund", launchDate: "2000-02-16" },
  { ticker: "TDB911", name: "TD Canadian Bond Index Fund - e-Series", category: "bonds", assetType: "mutual-fund", launchDate: "2002-03-26" },

  // RBC index mutual funds — another major bank's DIY index lineup, for
  // comparing across providers, not just against ETFs.
  { ticker: "RBF556", name: "RBC Canadian Index Fund", category: "ca-equity", assetType: "mutual-fund", launchDate: "1998-10-13" },
  { ticker: "RBF557", name: "RBC U.S. Index Fund", category: "us-equity", assetType: "mutual-fund", launchDate: "1998-10-13" },
  { ticker: "RBF559", name: "RBC International Index Currency Neutral Fund", category: "international-equity", assetType: "mutual-fund", launchDate: "2000-01-01" },

  // Scotia index mutual funds — a third bank family.
  { ticker: "BNS181", name: "Scotia Canadian Index Fund", category: "ca-equity", assetType: "mutual-fund", launchDate: "1996-12-01" },
  { ticker: "BNS182", name: "Scotia U.S. Index Fund", category: "us-equity", assetType: "mutual-fund", launchDate: "1996-12-01" },
  { ticker: "BNS187", name: "Scotia International Index Fund", category: "international-equity", assetType: "mutual-fund", launchDate: "1997-01-01" },
];

export const ETF_ONLY_LIST: EtfMeta[] = ETF_LIST.filter((fund) => fund.assetType === "etf");

export function getEtfMeta(ticker: string): EtfMeta | undefined {
  return ETF_LIST.find((etf) => etf.ticker === ticker.toUpperCase());
}
